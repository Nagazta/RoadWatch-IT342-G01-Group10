package com.example.roadwatch

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.util.Log.e
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat.startActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import com.example.roadwatch.repository.AuthRepository
import com.example.roadwatch.utils.PreferenceManager
import com.google.android.material.textfield.TextInputEditText
import kotlinx.coroutines.launch

class LoginPage : AppCompatActivity() {

    private lateinit var emailInput: TextInputEditText
    private lateinit var passwordInput: TextInputEditText
    private lateinit var btnSignIn: Button
    private lateinit var btnCreateAccount: Button
    private lateinit var btnGoogleSignIn: Button
    private lateinit var tvForgotPassword: TextView

    private lateinit var prefManager: PreferenceManager
    private val authRepository = AuthRepository()

    companion object {
        private const val TAG = "LoginPage"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_login_page)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Initialize views
        initializeViews()

        // Initialize preference manager
        prefManager = PreferenceManager(this)

        // Check if already logged in
        if (prefManager.isLoggedIn()) {
            Log.d(TAG, "User already logged in, navigating to dashboard")
            navigateToDashboard()
            return
        }

        // Set up click listeners
        setupClickListeners()
    }

    private fun initializeViews() {
        emailInput = findViewById(R.id.emailInput)
        passwordInput = findViewById(R.id.passwordInput)
        btnSignIn = findViewById(R.id.btnSignIn)
        btnCreateAccount = findViewById(R.id.btnCreateAccount)
        btnGoogleSignIn = findViewById(R.id.btnGoogleSignIn)
        tvForgotPassword = findViewById(R.id.tvForgotPassword)
    }

    private fun setupClickListeners() {
        btnSignIn.setOnClickListener {
            performLogin()
        }

        btnCreateAccount.setOnClickListener {
            val intent = Intent(this, RegisterPage::class.java)
            startActivity(intent)
        }

        btnGoogleSignIn.setOnClickListener {
            // TODO: Implement Google Sign-In with Supabase
            Toast.makeText(this, "Google Sign-In coming soon!", Toast.LENGTH_SHORT).show()
        }

        tvForgotPassword.setOnClickListener {
            // TODO: Implement Forgot Password
            Toast.makeText(this, "Forgot Password feature coming soon!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun performLogin() {
        val email = emailInput.text.toString().trim()
        val password = passwordInput.text.toString().trim()

        // Validation
        if (!validateInputs(email, password)) {
            return
        }

        // Show loading state
        setLoading(true)

        // Make API call
        lifecycleScope.launch {
            try {
                Log.d(TAG, "Attempting login for email: $email")
                val response = authRepository.localLogin(email, password)

                if (response.isSuccessful && response.body() != null) {
                    val authResponse = response.body()!!
                    Log.d(TAG, "Login successful for user: ${authResponse.user.name}")

                    // Save token and user data
                    prefManager.saveAuthToken(authResponse.accessToken)  // Changed from .token
                    prefManager.saveCompleteUserData(authResponse.user)

                    Toast.makeText(
                        this@LoginPage,
                        "Welcome back, ${authResponse.user.name}!",
                        Toast.LENGTH_SHORT
                    ).show()

                    navigateToDashboard()
                } else {
                    handleLoginError(response.code())
                }
            } catch (e: java.net.UnknownHostException) {
                Log.e(TAG, "Network error: Unable to resolve host", e)
                Toast.makeText(
                    this@LoginPage,
                    "Cannot connect to server. Please check your internet connection.",
                    Toast.LENGTH_LONG
                ).show()
            } catch (e: java.net.SocketTimeoutException) {
                Log.e(TAG, "Network error: Connection timeout", e)
                Toast.makeText(
                    this@LoginPage,
                    "Connection timeout. Please try again.",
                    Toast.LENGTH_LONG
                ).show()
            } catch (e: Exception) {
                Log.e(TAG, "Login error", e)
                Toast.makeText(
                    this@LoginPage,
                    "An error occurred: ${e.localizedMessage}",
                    Toast.LENGTH_LONG
                ).show()
            } finally {
                setLoading(false)
            }
        }
    }

    private fun validateInputs(email: String, password: String): Boolean {
        if (email.isEmpty()) {
            emailInput.error = "Email is required"
            emailInput.requestFocus()
            return false
        }

        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            emailInput.error = "Please enter a valid email"
            emailInput.requestFocus()
            return false
        }

        if (password.isEmpty()) {
            passwordInput.error = "Password is required"
            passwordInput.requestFocus()
            return false
        }

        if (password.length < 6) {
            passwordInput.error = "Password must be at least 6 characters"
            passwordInput.requestFocus()
            return false
        }

        return true
    }

    private fun handleLoginError(code: Int) {
        val errorMsg = when (code) {
            400 -> "Invalid request. Please check your credentials."
            401 -> "Invalid email or password"
            403 -> "Access denied. Please contact support."
            404 -> "User not found. Please create an account."
            500 -> "Server error. Please try again later."
            503 -> "Service unavailable. Please try again later."
            else -> "Login failed. Please try again."
        }
        Log.e(TAG, "Login failed with code: $code")
        Toast.makeText(this@LoginPage, errorMsg, Toast.LENGTH_LONG).show()
    }

    private fun setLoading(isLoading: Boolean) {
        btnSignIn.isEnabled = !isLoading
        btnCreateAccount.isEnabled = !isLoading
        btnGoogleSignIn.isEnabled = !isLoading
        emailInput.isEnabled = !isLoading
        passwordInput.isEnabled = !isLoading
        tvForgotPassword.isEnabled = !isLoading

        // Change button text to show loading state
        btnSignIn.text = if (isLoading) "Signing In..." else "Sign In"
    }

    private fun navigateToDashboard() {
        val intent = Intent(this, CitizenDashboard::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }
}