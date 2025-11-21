package com.example.roadwatch

import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import android.widget.ImageView
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
class CitizenDashboard : AppCompatActivity() , NavigationView.OnNavigationItemSelectedListener {

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navigationView: NavigationView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_citizen_dashboard)

        drawerLayout = findViewById(R.id.drawerLayout)
        navigationView = findViewById(R.id.navigationView)

        navigationView.setNavigationItemSelectedListener(this)

        // Menu icon click listener
        val menuIcon = findViewById<ImageView>(R.id.menuIcon)
        menuIcon.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
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
                // Navigate to Settings
            }
            R.id.nav_feedback -> {
                // Navigate to Feedback
            }
            R.id.nav_logout -> {
                // Handle logout - go back to login page
                val intent = Intent(this, LoginPage::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                startActivity(intent)
                finish()
            }
        }

        drawerLayout.closeDrawer(GravityCompat.START)
        return true
    }
}