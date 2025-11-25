package com.example.roadwatch

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Geocoder
import android.location.Location
import android.os.Build
import android.os.Bundle
import android.view.MenuItem
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.lifecycle.lifecycleScope
import com.example.roadwatch.models.ReportEntity
import com.example.roadwatch.network.RetrofitClient
import com.example.roadwatch.repository.ReportRepository
import com.example.roadwatch.utils.PreferenceManager
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.material.navigation.NavigationView
import com.google.android.material.textfield.TextInputEditText
import kotlinx.coroutines.launch
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import java.util.*
import kotlin.jvm.java

class CitizenSubmit : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navigationView: NavigationView
    private lateinit var mapView: MapView
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var tvLocationAddress: TextView
    private lateinit var tvCoordinates: TextView

    private var currentLatitude: Double = 0.0
    private var currentLongitude: Double = 0.0
    private var currentMarker: Marker? = null

    companion object {
        private const val LOCATION_PERMISSION_REQUEST_CODE = 1001
        private const val STORAGE_PERMISSION_REQUEST_CODE = 2001
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Configure OSM BEFORE setContentView
        Configuration.getInstance().load(this, getPreferences(MODE_PRIVATE))
        Configuration.getInstance().userAgentValue = packageName

        setContentView(R.layout.activity_citizen_submit)

        // Request storage permission for OSM (for Android 6.0+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE),
                    STORAGE_PERMISSION_REQUEST_CODE
                )
            }
        }

        // Initialize views
        drawerLayout = findViewById(R.id.drawerLayout)
        navigationView = findViewById(R.id.navigationView)
        mapView = findViewById(R.id.mapView)
        tvLocationAddress = findViewById(R.id.tvLocationAddress)
        tvCoordinates = findViewById(R.id.tvCoordinates)

        navigationView.setNavigationItemSelectedListener(this)

        // Setup location client
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        // Setup map
        setupMap()

        // Menu icon
        val menuIcon = findViewById<ImageView>(R.id.menuIcon)
        menuIcon.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }

        // Category dropdown
        setupCategoryDropdown()

        // Location buttons
        val btnAutoDetect = findViewById<Button>(R.id.btnAutoDetect)
        btnAutoDetect.setOnClickListener {
            requestLocationPermission()
        }

        val btnViewMap = findViewById<Button>(R.id.btnViewMap)
        btnViewMap.setOnClickListener {
            Toast.makeText(this, "Long press on the map to set location manually", Toast.LENGTH_LONG).show()
        }

        // Submit button
        val btnSubmit = findViewById<Button>(R.id.btnSubmit)
        btnSubmit.setOnClickListener {
            submitReport()
        }

        // Cancel button
        val btnCancel = findViewById<Button>(R.id.btnCancel)
        btnCancel.setOnClickListener {
            finish()
        }

        // Photo upload
        val photoUploadCard = findViewById<androidx.cardview.widget.CardView>(R.id.photoUploadCard)
        photoUploadCard.setOnClickListener {
            Toast.makeText(this, "Photo upload coming soon!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun setupMap() {
        try {
            mapView.setTileSource(TileSourceFactory.MAPNIK)
            mapView.setMultiTouchControls(true)
            mapView.setBuiltInZoomControls(false)

            // Default location (Cebu City)
            val startPoint = GeoPoint(10.3157, 123.8854)
            mapView.controller.setZoom(15.0)
            mapView.controller.setCenter(startPoint)

            // Add long press listener to manually set location
            val mapEventsReceiver = object : org.osmdroid.events.MapEventsReceiver {
                override fun singleTapConfirmedHelper(p: GeoPoint?): Boolean {
                    return false
                }

                override fun longPressHelper(p: GeoPoint?): Boolean {
                    p?.let {
                        setLocationOnMap(it)
                    }
                    return true
                }
            }

            val mapEventsOverlay = org.osmdroid.views.overlay.MapEventsOverlay(mapEventsReceiver)
            mapView.overlays.add(0, mapEventsOverlay)

        } catch (e: Exception) {
            Toast.makeText(this, "Map initialization error: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }
    private fun setLocationOnMap(geoPoint: GeoPoint) {
        currentLatitude = geoPoint.latitude
        currentLongitude = geoPoint.longitude

        // Get selected category
        val categoryDropdown = findViewById<AutoCompleteTextView>(R.id.categoryDropdown)
        val category = categoryDropdown.text.toString()

        // Update marker with category icon
        if (currentMarker == null) {
            currentMarker = Marker(mapView)
            mapView.overlays.add(currentMarker)
        }

        // Set icon based on category
        val iconResource = when (category) {
            "Pothole" -> R.drawable.ic_pothole
            "Crack" -> R.drawable.ic_crack
            "Debris" -> R.drawable.ic_debris
            "Faded Markings" -> R.drawable.ic_faded_markings
            "Damaged Sign" -> R.drawable.ic_damaged_sign
            "Other" -> R.drawable.ic_other
            else -> android.R.drawable.ic_menu_mylocation
        }

        currentMarker?.icon = resources.getDrawable(iconResource, null)
        currentMarker?.position = geoPoint
        currentMarker?.setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
        currentMarker?.title = "Report Location"

        mapView.invalidate()

        // Update UI
        tvCoordinates.text = "Lat: %.6f, Long: %.6f".format(currentLatitude, currentLongitude)
        getAddressFromLocation(currentLatitude, currentLongitude)

        Toast.makeText(this, "Location set!", Toast.LENGTH_SHORT).show()
    }
    private fun setupCategoryDropdown() {
        val categories = arrayOf("Pothole", "Crack", "Debris", "Faded Markings", "Damaged Sign", "Other")
        val adapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, categories)
        val categoryDropdown = findViewById<AutoCompleteTextView>(R.id.categoryDropdown)
        categoryDropdown.setAdapter(adapter)

        // Update marker icon when category changes
        categoryDropdown.setOnItemClickListener { _, _, _, _ ->
            if (currentMarker != null && currentLatitude != 0.0 && currentLongitude != 0.0) {
                setLocationOnMap(GeoPoint(currentLatitude, currentLongitude))
            }
        }
    }

    private fun requestLocationPermission() {
        // Check if location is enabled
        val locationManager = getSystemService(LOCATION_SERVICE) as android.location.LocationManager
        val isGpsEnabled = locationManager.isProviderEnabled(android.location.LocationManager.GPS_PROVIDER)
        val isNetworkEnabled = locationManager.isProviderEnabled(android.location.LocationManager.NETWORK_PROVIDER)

        if (!isGpsEnabled && !isNetworkEnabled) {
            Toast.makeText(
                this,
                "Please enable location services in your phone settings",
                Toast.LENGTH_LONG
            ).show()

            // Open location settings
            val intent = Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS)
            startActivity(intent)
            return
        }

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
            != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                LOCATION_PERMISSION_REQUEST_CODE
            )
        } else {
            getCurrentLocation()
        }
    }

    private fun getCurrentLocation() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
            != PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(this, "Location permission not granted", Toast.LENGTH_SHORT).show()
            return
        }

        Toast.makeText(this, "Getting location...", Toast.LENGTH_SHORT).show()

        fusedLocationClient.lastLocation.addOnSuccessListener { location: Location? ->
            location?.let {
                val geoPoint = GeoPoint(it.latitude, it.longitude)
                setLocationOnMap(geoPoint)
                mapView.controller.animateTo(geoPoint)
                mapView.controller.setZoom(18.0)

                Toast.makeText(this, "Location detected!", Toast.LENGTH_SHORT).show()
            } ?: run {
                Toast.makeText(this, "Unable to get location. Please try again.", Toast.LENGTH_LONG).show()
            }
        }.addOnFailureListener { e ->
            Toast.makeText(this, "Location error: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    private fun getAddressFromLocation(lat: Double, lng: Double) {
        try {
            val geocoder = Geocoder(this, Locale.getDefault())
            val addresses = geocoder.getFromLocation(lat, lng, 1)
            if (!addresses.isNullOrEmpty()) {
                val address = addresses[0].getAddressLine(0)
                tvLocationAddress.text = address ?: "Address not available"
            } else {
                tvLocationAddress.text = "Address not available"
            }
        } catch (e: Exception) {
            tvLocationAddress.text = "Address not available"
            Toast.makeText(this, "Geocoding error: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun submitReport() {
        val title = findViewById<TextInputEditText>(R.id.titleInput).text.toString()
        val description = findViewById<TextInputEditText>(R.id.descriptionInput).text.toString()
        val category = findViewById<AutoCompleteTextView>(R.id.categoryDropdown).text.toString()
        val locationAddress = tvLocationAddress.text.toString() // address from geocoder

        if (title.isEmpty() || description.isEmpty() || category.isEmpty() ||
            (currentLatitude == 0.0 && currentLongitude == 0.0)
        ) {
            Toast.makeText(this, "Please fill all fields and set location", Toast.LENGTH_SHORT).show()
            return
        }

        // Get logged-in user's email
        val email = PreferenceManager(this).getUserEmail()
        if (email.isNullOrEmpty()) {
            Toast.makeText(this, "User email not found. Please login again.", Toast.LENGTH_LONG).show()
            return
        }

        // Create report object
        val report = ReportEntity(
            title = title,
            description = description,
            location = locationAddress.ifEmpty { "Unknown Location" },
            latitude = currentLatitude,
            longitude = currentLongitude,
            status = "PENDING", // default status
            category = category,
            submittedBy = email
        )

        // Make network call
        lifecycleScope.launch {
            try {
                val repo = ReportRepository(RetrofitClient.apiService) // your retrofit instance
                val response = repo.submitReport(report, email)

                if (response.isSuccessful) {
                    Toast.makeText(this@CitizenSubmit, "Report submitted successfully!", Toast.LENGTH_LONG).show()
                    // Navigate back to dashboard
                    val intent = Intent(this@CitizenSubmit, CitizenDashboard::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
                    startActivity(intent)
                    finish()
                } else {
                    Toast.makeText(
                        this@CitizenSubmit,
                        "Failed to submit report: ${response.code()} ${response.message()}",
                        Toast.LENGTH_LONG
                    ).show()
                }

            } catch (e: Exception) {
                Toast.makeText(this@CitizenSubmit, "Error: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
            }
        }
    }



    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        when (requestCode) {
            LOCATION_PERMISSION_REQUEST_CODE -> {
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    getCurrentLocation()
                } else {
                    Toast.makeText(this, "Location permission denied", Toast.LENGTH_SHORT).show()
                }
            }
            STORAGE_PERMISSION_REQUEST_CODE -> {
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    Toast.makeText(this, "Storage permission granted", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this, "Storage permission denied - map tiles may not load", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.nav_dashboard -> {
                val intent = Intent(this, CitizenDashboard::class.java)
                startActivity(intent)
                finish()
            }
            R.id.nav_my_reports -> {
                val intent = Intent(this, CitizenReports::class.java)
                startActivity(intent)
                finish()
            }
            R.id.nav_submit_reports -> {
                // Already here
            }
            R.id.nav_settings -> {
                Toast.makeText(this, "Settings coming soon", Toast.LENGTH_SHORT).show()
            }
            R.id.nav_feedback -> {
                Toast.makeText(this, "Feedback coming soon", Toast.LENGTH_SHORT).show()
            }
            R.id.nav_logout -> {
                val intent = Intent(this, LoginPage::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                startActivity(intent)
                finish()
            }
        }
        drawerLayout.closeDrawer(GravityCompat.START)
        return true
    }

    override fun onResume() {
        super.onResume()
        mapView.onResume()
    }

    override fun onPause() {
        super.onPause()
        mapView.onPause()
    }

    override fun onDestroy() {
        super.onDestroy()
        mapView.onDetach()
    }
}