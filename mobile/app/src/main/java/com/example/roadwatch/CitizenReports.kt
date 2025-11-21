package com.example.roadwatch

import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.navigation.NavigationView
import kotlin.jvm.java

class CitizenReports : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {

    private lateinit var reportsRecyclerView: RecyclerView
    private lateinit var reportAdapter: ReportAdapter
    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navigationView: NavigationView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_citizen_reports)

        // Setup DrawerLayout if it exists
        try {
            drawerLayout = findViewById(R.id.drawerLayout)
            navigationView = findViewById(R.id.navigationView)
            navigationView.setNavigationItemSelectedListener(this)
        } catch (e: Exception) {
            // DrawerLayout not in this layout, just use menu icon for back
        }

        // Menu icon click listener
        val menuIcon = findViewById<ImageView>(R.id.menuIcon)
        menuIcon.setOnClickListener {
            if (::drawerLayout.isInitialized) {
                drawerLayout.openDrawer(GravityCompat.START)
            } else {
                // If no drawer, go back
                finish()
            }
        }

        // Setup RecyclerView
        reportsRecyclerView = findViewById(R.id.reportsRecyclerView)
        reportsRecyclerView.layoutManager = LinearLayoutManager(this)

        // Sample data
        val reports = listOf(
            Report("Large pothole on Main Street", "Deep pothole causing vehicle damage...", "Pothole", "Under Review", "1/15/2024"),
            Report("Cracked pavement near school", "Safety hazard for pedestrians...", "Crack", "Resolved", "1/12/2024"),
            Report("Debris blocking bike lane", "Construction debris in cycling area...", "Debris", "Pending", "1/18/2024")
        )

        reportAdapter = ReportAdapter(reports)
        reportsRecyclerView.adapter = reportAdapter
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

    override fun onBackPressed() {
        if (::drawerLayout.isInitialized && drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }
}

data class Report(
    val title: String,
    val description: String,
    val category: String,
    val status: String,
    val date: String
)