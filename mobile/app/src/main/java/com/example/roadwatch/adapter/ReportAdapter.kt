package com.example.roadwatch

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView
import com.example.roadwatch.models.ReportEntity
import java.text.SimpleDateFormat
import java.util.Locale

class ReportAdapter(private val reports: List<ReportEntity>) : RecyclerView.Adapter<ReportAdapter.ReportViewHolder>() {

    class ReportViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val reportTitle: TextView = view.findViewById(R.id.reportTitle)
        val reportDescription: TextView = view.findViewById(R.id.reportDescription)
        val categoryTag: TextView = view.findViewById(R.id.categoryTag)
        val statusTag: TextView = view.findViewById(R.id.statusTag)
        val statusTagCard: CardView = view.findViewById(R.id.statusTagCard)
        val reportDate: TextView = view.findViewById(R.id.reportDate)
        val viewButton: Button = view.findViewById(R.id.viewButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ReportViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_report, parent, false)
        return ReportViewHolder(view)
    }
    fun formatDate(dateString: String?): String {
        if (dateString.isNullOrEmpty()) return "N/A"

        return try {
            // Input format with optional microseconds
            val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSSSS", Locale.getDefault())
            val date = inputFormat.parse(dateString)

            // Desired output format: "Nov 25, 2025"
            val outputFormat = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
            outputFormat.format(date!!)
        } catch (e: Exception) {
            e.printStackTrace()
            "N/A"
        }
    }


    override fun onBindViewHolder(holder: ReportViewHolder, position: Int) {
        val report = reports[position]

        holder.reportTitle.text = report.title
        holder.reportDescription.text = report.description
        holder.categoryTag.text = report.category ?: "N/A"
        holder.statusTag.text = report.status
        holder.reportDate.text = formatDate(report.dateSubmitted)

        // Map backend status to color
        val statusColor = when (report.status.uppercase()) {
            "PENDING" -> "#FFA726"      // Orange
            "IN_PROGRESS" -> "#2196F3"  // Blue
            "RESOLVED" -> "#4CAF50"     // Green
            "REJECTED" -> "#F44336"     // Red
            else -> "#BDBDBD"            // Gray for unknown
        }
        holder.statusTagCard.setCardBackgroundColor(Color.parseColor(statusColor))

        // Handle View button click
        holder.viewButton.setOnClickListener {
            // TODO: navigate to Report Details page, passing report.id or the whole object
        }
    }

    override fun getItemCount() = reports.size
}
