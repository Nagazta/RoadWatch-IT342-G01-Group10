package com.example.roadwatch

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView

class ReportAdapter(private val reports: List<Report>) : RecyclerView.Adapter<ReportAdapter.ReportViewHolder>() {

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

    override fun onBindViewHolder(holder: ReportViewHolder, position: Int) {
        val report = reports[position]

        holder.reportTitle.text = report.title
        holder.reportDescription.text = report.description
        holder.categoryTag.text = report.category
        holder.statusTag.text = report.status
        holder.reportDate.text = report.date

        // Set status color on the CardView
        when (report.status) {
            "Under Review" -> holder.statusTagCard.setCardBackgroundColor(Color.parseColor("#2196F3"))
            "Resolved" -> holder.statusTagCard.setCardBackgroundColor(Color.parseColor("#4CAF50"))
            "Pending" -> holder.statusTagCard.setCardBackgroundColor(Color.parseColor("#FFA726"))
        }

        // View button click listener
        holder.viewButton.setOnClickListener {
            // Handle view button click - navigate to report details page
        }
    }

    override fun getItemCount() = reports.size
}