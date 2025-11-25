package com.example.roadwatch.models

import com.google.gson.annotations.SerializedName

data class LoginRequest(
    val email: String,
    val password: String
)

data class GoogleAuthRequest(
    @SerializedName("accessToken")
    val accessToken: String
)

data class AuthResponse(
    val success: Boolean? = null,
    val message: String? = null,
    val accessToken: String,  // Add this field
    val refreshToken: String? = null,
    val user: UserDTO
)

data class UserDTO(
    val id: Long,
    val supabaseId: String?,
    val username: String,
    val name: String,
    val email: String,
    val role: String,
    val contact: String?
)