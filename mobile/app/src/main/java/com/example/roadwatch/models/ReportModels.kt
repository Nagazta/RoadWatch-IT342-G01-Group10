package com.example.roadwatch.models

import com.google.gson.annotations.SerializedName

data class ReportEntity(
    val id: Long? = null,
    val title: String,
    val description: String,
    val location: String,
    val latitude: Double,
    val longitude: Double,
    val status: String, // PENDING, IN_PROGRESS, RESOLVED, REJECTED
    val severity: String? = null,
    val category: String? = null,
    val imageUrl: String? = null,
    val submittedBy: String? = null,
    val assignedTo: String? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class DashboardStats(
    val total: Int = 0,
    val pending: Int = 0,
    val inProgress: Int = 0,
    val resolved: Int = 0
)