package com.example.roadwatch.repository

import com.example.roadwatch.models.ReportEntity
import com.example.roadwatch.network.RetrofitClient
import retrofit2.Response

class ReportRepository {

    suspend fun getAllReports(token: String): Response<List<ReportEntity>> {
        val authenticatedService = RetrofitClient.createAuthenticatedClient(token)
        return authenticatedService.getAllReports()
    }

    suspend fun getUserReports(email: String, token: String): Response<List<ReportEntity>> {
        val authenticatedService = RetrofitClient.createAuthenticatedClient(token)
        return authenticatedService.getReportsByEmail(email)
    }

    suspend fun createReport(
        report: ReportEntity,
        submittedBy: String,
        token: String
    ): Response<ReportEntity> {
        val authenticatedService = RetrofitClient.createAuthenticatedClient(token)
        return authenticatedService.createReport(report, submittedBy)
    }
}