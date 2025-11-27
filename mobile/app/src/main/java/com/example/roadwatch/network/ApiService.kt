package com.example.roadwatch.network

import com.example.roadwatch.models.AuthResponse
import com.example.roadwatch.models.GoogleAuthRequest
import com.example.roadwatch.models.LoginRequest
import com.example.roadwatch.models.ReportEntity
import com.example.roadwatch.models.UserDTO
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    // Auth endpoints
    @POST("auth/local-login")
    suspend fun localLogin(@Body request: LoginRequest): Response<AuthResponse>

    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("auth/google")
    suspend fun googleLogin(@Body request: GoogleAuthRequest): Response<AuthResponse>

    @GET("auth/profile")
    suspend fun getProfile(): Response<UserDTO>

    @POST("auth/logout")
    suspend fun logout(): Response<String>

    // Report endpoints
    @GET("api/reports/getAll")
    suspend fun getAllReports(): Response<List<ReportEntity>>

    @GET("api/reports/getByEmail")
    suspend fun getReportsByEmail(@Query("email") email: String): Response<List<ReportEntity>>

    @GET("api/reports/getBy/{id}")
    suspend fun getReportById(@Path("id") id: Long): Response<ReportEntity>

    @POST("api/reports/add2")
    suspend fun createReport(
        @Body report: ReportEntity,
        @Query("submittedBy") submittedBy: String
    ): Response<ReportEntity>
}