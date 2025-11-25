package com.example.roadwatch

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.preference.PreferenceManager as AndroidPreferenceManager
import android.util.Log
import android.view.MenuItem
import android.view.View
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.lifecycle.lifecycleScope
import com.example.roadwatch.models.DashboardStats
import com.example.roadwatch.models.ReportEntity
import com.example.roadwatch.network.RetrofitClient
import com.example.roadwatch.repository.AuthRepository
import com.example.roadwatch.repository.ReportRepository
import com.example.roadwatch.utils.PreferenceManager
import com.google.android.material.navigation.NavigationView
import kotlinx.coroutines.launch
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class CitizenDashboard : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navigationView: NavigationView
    private lateinit var prefManager: PreferenceManager
    private lateinit var mapView: MapView
    private lateinit var mapLoadingProgress: ProgressBar
    private lateinit var btnRefreshMap: Button

    // Stats TextViews
    private lateinit var tvTotalReports: TextView
    private lateinit var tvPendingReports: TextView
    private lateinit var tvInProgressReports: TextView
    private lateinit var tvResolvedReports: TextView

    private val authRepository = AuthRepository()
    private val reportRepository = ReportRepository(RetrofitClient.apiService)

    private var allReports: List<ReportEntity> = emptyList()

    companion object {
        private const val TAG = "CitizenDashboard"
        private const val PERMISSION_REQUEST_CODE = 1001

        // Default center point - Cebu City
        private val CEBU_CITY_CENTER = GeoPoint(10.3157, 123.8854)
        private const val DEFAULT_ZOOM = 13.0
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize OSMDroid configuration BEFORE setContentView
        Configuration.getInstance().load(
            this,
            AndroidPreferenceManager.getDefaultSharedPreferences(this)
        )

        // Set user agent to prevent issues
        Configuration.getInstance().userAgentValue = packageName

        setContentView(R.layout.activity_citizen_dashboard)

        // Request location permissions
        requestPermissions()

        // Initialize views
        initializeViews()

        // Initialize preference manager
        prefManager = PreferenceManager(this)

        navigationView.setNavigationItemSelectedListener(this)

        // Menu icon click listener
        val menuIcon = findViewById<android.widget.ImageView>(R.id.menuIcon)
        menuIcon.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }

        // Set up map
        setupMap()

        // Update user info in header
        updateUserInfo()

        // Load dashboard data
        loadDashboardData()

        // Refresh button
        btnRefreshMap.setOnClickListener {
            loadDashboardData()
        }
    }

    private fun initializeViews() {
        drawerLayout = findViewById(R.id.drawerLayout)
        navigationView = findViewById(R.id.navigationView)
        mapView = findViewById(R.id.dashboardMapView)
        mapLoadingProgress = findViewById(R.id.mapLoadingProgress)
        btnRefreshMap = findViewById(R.id.btnRefreshMap)

        // Initialize stats TextViews
        tvTotalReports = findViewById(R.id.tvTotalReports)
        tvPendingReports = findViewById(R.id.tvPendingReports)
        tvInProgressReports = findViewById(R.id.tvInProgressReports)
        tvResolvedReports = findViewById(R.id.tvResolvedReports)
    }

    private fun requestPermissions() {
        val permissions = arrayOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
        )

        val permissionsToRequest = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (permissionsToRequest.isNotEmpty()) {
            ActivityCompat.requestPermissions(
                this,
                permissionsToRequest.toTypedArray(),
                PERMISSION_REQUEST_CODE
            )
        }
    }

    private fun setupMap() {
        try {
            // Configure map
            mapView.setTileSource(TileSourceFactory.MAPNIK)
            mapView.setMultiTouchControls(true)
            mapView.setBuiltInZoomControls(false)

            // Set default view to Cebu City
            mapView.controller.setZoom(DEFAULT_ZOOM)
            mapView.controller.setCenter(CEBU_CITY_CENTER)

            // Enable hardware acceleration
            mapView.setLayerType(View.LAYER_TYPE_HARDWARE, null)

            Log.d(TAG, "Map setup completed - Center: ${CEBU_CITY_CENTER.latitude}, ${CEBU_CITY_CENTER.longitude}")

        } catch (e: Exception) {
            Log.e(TAG, "Error setting up map", e)
            Toast.makeText(this, "Error initializing map", Toast.LENGTH_SHORT).show()
        }
    }

    private fun updateUserInfo() {
        val userName = prefManager.getUserName() ?: "User"
        val userRole = prefManager.getUserRole() ?: "CITIZEN"

        // Update top bar
        findViewById<TextView>(R.id.userName)?.text = userName
        findViewById<TextView>(R.id.userRole)?.text = userRole.lowercase()
            .replaceFirstChar { it.uppercase() }


    }

    private fun loadDashboardData() {
        val token = prefManager.getAuthToken()
        val userEmail = prefManager.getUserEmail()
        val role = prefManager.getUserRole()

        if (token.isNullOrEmpty()) {
            Toast.makeText(this, "Session expired. Please login again.", Toast.LENGTH_LONG).show()
            navigateToLogin()
            return
        }

        mapLoadingProgress.visibility = View.VISIBLE

        lifecycleScope.launch {
            try {
                Log.d(TAG, "Loading dashboard data for user: $userEmail")

                val allReportsResponse = reportRepository.getAllReports(token)

                if (allReportsResponse.isSuccessful && allReportsResponse.body() != null) {
                    val reportsFromBackend = allReportsResponse.body()!!

                    // Filter by logged-in user's email if not admin
                    allReports = if (role.equals("admin", ignoreCase = true)) {
                        reportsFromBackend
                    } else {
                        reportsFromBackend.filter { it.submittedBy == userEmail }
                    }

                    Log.d(TAG, "Loaded ${allReports.size} reports for user $userEmail")

                    updateMapMarkers(allReports)

                    // Update stats
                    updateStats(allReports) // already filtered

                } else {
                    Log.e(TAG, "Failed to load reports: ${allReportsResponse.code()}")
                    Toast.makeText(
                        this@CitizenDashboard,
                        "Failed to load reports: ${allReportsResponse.code()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }

            } catch (e: Exception) {
                Log.e(TAG, "Error loading dashboard data", e)
                Toast.makeText(
                    this@CitizenDashboard,
                    "Error: ${e.localizedMessage}",
                    Toast.LENGTH_SHORT
                ).show()
            } finally {
                mapLoadingProgress.visibility = View.GONE
            }
        }
    }


    private fun updateMapMarkers(reports: List<ReportEntity>) {
        try {
            mapView.overlays.clear()

            if (reports.isEmpty()) {
                Log.d(TAG, "No reports to display on map")
                mapView.invalidate()
                return
            }

            var validMarkerCount = 0
            val bounds = mutableListOf<GeoPoint>()

            reports.forEach { report ->
                if (report.latitude != 0.0 && report.longitude != 0.0) {
                    try {
                        val marker = Marker(mapView)
                        val position = GeoPoint(report.latitude, report.longitude)

                        marker.position = position
                        marker.title = report.title
                        marker.snippet = "Status: ${report.status}\n${report.description}"
                        marker.setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)

                        // ✅ Bring back TRUE STATUS-BASED ICONS
                        marker.icon = when (report.status.uppercase()) {
                            "PENDING" -> ContextCompat.getDrawable(this, R.drawable.ic_marker_yellow)
                            "IN_PROGRESS" -> ContextCompat.getDrawable(this, R.drawable.ic_marker_blue)
                            "RESOLVED" -> ContextCompat.getDrawable(this, R.drawable.ic_marker_green)
                            "REJECTED" -> ContextCompat.getDrawable(this, R.drawable.ic_marker_red)
                            else -> ContextCompat.getDrawable(this, R.drawable.ic_marker_gray)
                        }

                        marker.setOnMarkerClickListener { _, _ ->
                            showReportDetails(report)
                            true
                        }

                        mapView.overlays.add(marker)
                        bounds.add(position)
                        validMarkerCount++

                    } catch (e: Exception) {
                        Log.e(TAG, "Error creating marker for report ${report.id}", e)
                    }
                } else {
                    Log.w(TAG, "Skipping invalid location for report ${report.id}")
                }
            }

            // Centering logic
            if (bounds.isNotEmpty()) {
                val centerLat = bounds.map { it.latitude }.average()
                val centerLon = bounds.map { it.longitude }.average()

                val centerPoint = GeoPoint(centerLat, centerLon)
                mapView.controller.setCenter(centerPoint)

                if (bounds.size > 1) {
                    mapView.controller.setZoom(12.0)
                }
            } else {
                mapView.controller.setCenter(CEBU_CITY_CENTER)
                mapView.controller.setZoom(DEFAULT_ZOOM)
            }

            mapView.invalidate()

        } catch (e: Exception) {
            Log.e(TAG, "Error updating markers", e)
            Toast.makeText(this, "Error displaying markers", Toast.LENGTH_SHORT).show()
        }
    }


    private fun updateStats(userReports: List<ReportEntity>) {
        val stats = DashboardStats(
            total = userReports.size,
            pending = userReports.count { it.status.equals("PENDING", ignoreCase = true) },
            inProgress = userReports.count { it.status.equals("IN_PROGRESS", ignoreCase = true) },
            resolved = userReports.count { it.status.equals("RESOLVED", ignoreCase = true) }
        )

        tvTotalReports.text = stats.total.toString()
        tvPendingReports.text = stats.pending.toString()
        tvInProgressReports.text = stats.inProgress.toString()
        tvResolvedReports.text = stats.resolved.toString()

        Log.d(TAG, "Stats updated: Total=${stats.total}, Pending=${stats.pending}, InProgress=${stats.inProgress}, Resolved=${stats.resolved}")
    }

    private fun showReportDetails(report: ReportEntity) {
        AlertDialog.Builder(this)
            .setTitle(report.title)
            .setMessage("""
                Location: ${report.location}
                Status: ${report.status}
                Category: ${report.category ?: "N/A"}
                Severity: ${report.severity ?: "N/A"}
                
                Description:
                ${report.description}
                
                Submitted by: ${report.submittedBy ?: "Unknown"}
                Created: ${formatDateToReadable(report.dateSubmitted)}
            """.trimIndent())
            .setPositiveButton("Close", null)
            .show()
    }
    fun formatDateToReadable(dateString: String?): String {
        if (dateString.isNullOrEmpty()) return "N/A"

        return try {
            // Parse the ISO 8601 date string
            val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSSSS", Locale.getDefault())
            val date: Date = isoFormat.parse(dateString)!!

            // Format to "Nov 25, 2025"
            val readableFormat = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
            readableFormat.format(date)
        } catch (e: Exception) {
            e.printStackTrace()
            dateString // fallback to original if parsing fails
        }
    }


    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.nav_dashboard -> {
                // Already on dashboard
            }
            R.id.nav_my_reports -> {
                val intent = Intent(this, CitizenReports::class.java)
                startActivity(intent)
            }
            R.id.nav_submit_reports -> {
                val intent = Intent(this, CitizenSubmit::class.java)
                startActivity(intent)
            }
            R.id.nav_settings -> {
                Toast.makeText(this, "Settings coming soon!", Toast.LENGTH_SHORT).show()
            }
            R.id.nav_feedback -> {
                Toast.makeText(this, "Feedback coming soon!", Toast.LENGTH_SHORT).show()
            }
            R.id.nav_logout -> {
                showLogoutConfirmationDialog()
            }
        }

        drawerLayout.closeDrawer(GravityCompat.START)
        return true
    }

    private fun showLogoutConfirmationDialog() {
        AlertDialog.Builder(this)
            .setTitle("Logout")
            .setMessage("Are you sure you want to logout?")
            .setPositiveButton("Yes") { _, _ ->
                performLogout()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun performLogout() {
        lifecycleScope.launch {
            try {
                val token = prefManager.getAuthToken()

                if (!token.isNullOrEmpty()) {
                    try {
                        authRepository.logout(token)
                    } catch (e: Exception) {
                        Log.e(TAG, "Backend logout failed", e)
                    }
                }

                prefManager.clearAll()
                Toast.makeText(this@CitizenDashboard, "Logged out successfully", Toast.LENGTH_SHORT).show()
                navigateToLogin()

            } catch (e: Exception) {
                Log.e(TAG, "Logout error", e)
                prefManager.clearAll()
                navigateToLogin()
            }
        }
    }

    private fun navigateToLogin() {
        val intent = Intent(this, LoginPage::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }

    override fun onResume() {
        super.onResume()
        mapView.onResume()
        // Reload data when returning to dashboard
        loadDashboardData()
    }

    override fun onPause() {
        super.onPause()
        mapView.onPause()
    }

    override fun onDestroy() {
        super.onDestroy()
        mapView.onDetach()
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }) {
                Log.d(TAG, "All permissions granted")
            } else {
                Toast.makeText(this, "Location permissions denied", Toast.LENGTH_SHORT).show()
            }
        }
    }
}