package com.example.roadwatch.repository

import com.example.roadwatch.models.AuthResponse
import com.example.roadwatch.models.GoogleAuthRequest
import com.example.roadwatch.models.LoginRequest
import com.example.roadwatch.network.RetrofitClient
import retrofit2.Response

class AuthRepository {
    private val apiService = RetrofitClient.apiService

    suspend fun localLogin(email: String, password: String): Response<AuthResponse> {
        val request = LoginRequest(email, password)
        return apiService.localLogin(request)
    }

    suspend fun googleLogin(accessToken: String): Response<AuthResponse> {
        val request = GoogleAuthRequest(accessToken)
        return apiService.googleLogin(request)
    }

    suspend fun logout(token: String): Response<String> {
        val authenticatedService = RetrofitClient.createAuthenticatedClient(token)
        return authenticatedService.logout()
    }
}