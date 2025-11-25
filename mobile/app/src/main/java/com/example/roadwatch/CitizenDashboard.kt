package com.example.roadwatch

import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.lifecycle.lifecycleScope
import com.example.roadwatch.repository.AuthRepository
import com.example.roadwatch.utils.PreferenceManager
import com.google.android.material.navigation.NavigationView
import kotlinx.coroutines.launch

class CitizenDashboard : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navigationView: NavigationView
    private lateinit var prefManager: PreferenceManager
    private val authRepository = AuthRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_citizen_dashboard)

        drawerLayout = findViewById(R.id.drawerLayout)
        navigationView = findViewById(R.id.navigationView)

        // Initialize preference manager
        prefManager = PreferenceManager(this)

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
                Toast.makeText(this, "Settings coming soon!", Toast.LENGTH_SHORT).show()
            }
            R.id.nav_feedback -> {
                // Navigate to Feedback
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
                        android.util.Log.e("CitizenDashboard", "Backend logout failed", e)
                    }
                }

                prefManager.clearAll()
                Toast.makeText(this@CitizenDashboard, "Logged out successfully", Toast.LENGTH_SHORT).show()
                navigateToLogin()

            } catch (e: Exception) {
                android.util.Log.e("CitizenDashboard", "Logout error", e)
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
}