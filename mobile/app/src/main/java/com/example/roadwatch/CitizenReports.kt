package com.example.roadwatch

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.MenuItem
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.roadwatch.network.RetrofitClient
import com.example.roadwatch.repository.ReportRepository
import com.example.roadwatch.utils.PreferenceManager
import com.google.android.material.navigation.NavigationView
import kotlinx.coroutines.launch
import kotlin.jvm.java

class CitizenReports : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {

    private lateinit var reportsRecyclerView: RecyclerView
    private lateinit var reportAdapter: ReportAdapter
    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navigationView: NavigationView
    private lateinit var prefManager: PreferenceManager
    private val reportRepository = ReportRepository(RetrofitClient.apiService)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_citizen_reports)

        prefManager = PreferenceManager(this)

        // Setup DrawerLayout
        drawerLayout = findViewById(R.id.drawerLayout)
        navigationView = findViewById(R.id.navigationView)
        navigationView.setNavigationItemSelectedListener(this)

        val menuIcon = findViewById<ImageView>(R.id.menuIcon)
        menuIcon.setOnClickListener { drawerLayout.openDrawer(GravityCompat.START) }

        // RecyclerView
        reportsRecyclerView = findViewById(R.id.reportsRecyclerView)
        reportsRecyclerView.layoutManager = LinearLayoutManager(this)

        loadUserReports() // 🔹 Load reports dynamically
    }

    private fun loadUserReports() {
        val token = prefManager.getAuthToken()
        val email = prefManager.getUserEmail()

        if (token.isNullOrEmpty() || email.isNullOrEmpty()) return

        lifecycleScope.launch {
            try {
                val response = reportRepository.getUserReports(email, token)
                if (response.isSuccessful && response.body() != null) {
                    val userReports = response.body()!!
                    Log.d("CitizenReports", "Backend reports: $userReports")

                    // Use ReportEntity directly
                    reportAdapter = ReportAdapter(userReports)
                    reportsRecyclerView.adapter = reportAdapter

                } else {
                    Toast.makeText(
                        this@CitizenReports,
                        "Failed to load reports: ${response.code()}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            } catch (e: Exception) {
                Toast.makeText(
                    this@CitizenReports,
                    "Error: ${e.localizedMessage}",
                    Toast.LENGTH_SHORT
                ).show()
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
                // Already on this page
            }

            R.id.nav_submit_reports -> {
                val intent = Intent(this, CitizenSubmit::class.java)
                startActivity(intent)
            }

            R.id.nav_settings -> {
                // Navigate to Settings page
            }

            R.id.nav_feedback -> {
                // Navigate to Feedback page
            }

            R.id.nav_logout -> {
                val intent = Intent(this, LoginPage::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                startActivity(intent)
                finish()
            }
        }

        if (::drawerLayout.isInitialized) {
            drawerLayout.closeDrawer(GravityCompat.START)
        }
        return true
    }
}