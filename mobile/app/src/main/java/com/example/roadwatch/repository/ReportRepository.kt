package com.example.roadwatch.repository

import com.example.roadwatch.models.ReportEntity
import com.example.roadwatch.network.ApiService
import com.example.roadwatch.network.RetrofitClient
import retrofit2.Response

class ReportRepository(private val apiService: ApiService) {

    // Submit report without token (uses default apiService)
    suspend fun submitReport(report: ReportEntity, submittedBy: String): Response<ReportEntity> {
        return apiService.createReport(report, submittedBy)
    }

    // Get all reports with token (authenticated)
    suspend fun getAllReports(token: String): Response<List<ReportEntity>> {
        val authenticatedService = RetrofitClient.createAuthenticatedClient(token)
        return authenticatedService.getAllReports()
    }

    // Get user reports with token (authenticated)
    suspend fun getUserReports(email: String, token: String): Response<List<ReportEntity>> {
        val authenticatedService = RetrofitClient.createAuthenticatedClient(token)
        return authenticatedService.getReportsByEmail(email)
    }

    // Create report with token (authenticated)
    suspend fun createReport(
        report: ReportEntity,
        submittedBy: String,
        token: String
    ): Response<ReportEntity> {
        val authenticatedService = RetrofitClient.createAuthenticatedClient(token)
        return authenticatedService.createReport(report, submittedBy)
    }


}
