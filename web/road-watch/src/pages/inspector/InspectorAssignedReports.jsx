"use client"

import { useState } from "react"
import InspectorHeader from "./ins-components/InspectorHeader"
import InspectorSidebar from "./ins-components/InspectorSidebar"
import "./styles/InspectorAssignedReports.css"

export default function InspectorAssignedReports() {
  const [filters, setFilters] = useState({
    status: "",
    view: "",
  })

  const [currentPage, setCurrentPage] = useState(1)

  const assignedReports = [
    {
      id: "RPT-001",
      title: "Large Pothole on",
      category: "Pothole",
      location: "Cebu City",
      dateSubmitted: "2025-10-10",
    },
    {
      id: "RPT-EU",
      title: "Broken Traffic Light",
      category: "Traffic Signal",
      location: "Mandaue Ave, Mandaue",
      dateSubmitted: "2025-10-14",
    },
    {
      id: "RPT-482",
      title: "Damaged Sidewalk",
      category: "Sidewalk",
      location: "789 Pine Rd, Uptown",
      dateSubmitted: "2025-10-14",
    },
  ]

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="dashboard-container">
        <InspectorSidebar />
    <div className="dashboard-main">
      <InspectorHeader />
      <div className="dashboard-content">
        <div className="assigned-reports-container">
          <h1 className="page-title">Assigned Reports</h1>

          <div className="controls-section">
            <div className="filter-controls">
              <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select name="view" value={filters.view} onChange={handleFilterChange} className="filter-select">
                <option value="">Eye icon</option>
                <option value="list">List View</option>
                <option value="grid">Grid View</option>
              </select>
            </div>

            <div className="total-reports">
              Total reports: <span>{assignedReports.length}</span>
            </div>
          </div>

          <table className="reports-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Date Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedReports.map((report) => (
                <tr key={report.id}>
                  <td className="report-id">{report.id}</td>
                  <td>{report.title}</td>
                  <td>{report.category}</td>
                  <td>{report.location}</td>
                  <td>{report.dateSubmitted}</td>
                  <td>
                    <button className="btn-open-report">Open Report</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-info">
            Showing: {assignedReports.length} of {assignedReports.length} reports
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
