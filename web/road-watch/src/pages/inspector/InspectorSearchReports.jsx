"use client"

import { useState } from "react"
import InspectorHeader from "./ins-components/InspectorHeader.jsx"
import InspectorSidebar from "./ins-components/InspectorSidebar"
import "./styles/InspectorSearchReports.css"

export default function InspectorSearchReports() {
  const [filters, setFilters] = useState({
    reportName: "",
    category: "",
    status: "",
    address: "",
    datePrepared: "",
    reporter: "",
  })

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Search filters:", filters)
  }

  const handleClearAll = () => {
    setFilters({
      reportName: "",
      category: "",
      status: "",
      address: "",
      datePrepared: "",
      reporter: "",
    })
  }

  return (
    <div className="dashboard-container">
    <InspectorSidebar />
    <div className="dashboard-main">
      <InspectorHeader />
      <div className="dashboard-content">
        <div className="search-reports-container">
          <h1 className="page-title">Search Reports</h1>
          <p className="search-subtitle">Provide details of the Report:</p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reportName">Report Name/Title</label>
                <input
                  type="text"
                  id="reportName"
                  name="reportName"
                  placeholder="Enter report title or keywords..."
                  value={filters.reportName}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={filters.category} onChange={handleFilterChange}>
                  <option value="">All Categories</option>
                  <option value="pothole">Pothole</option>
                  <option value="crack">Crack</option>
                  <option value="sign">Sign Damage</option>
                  <option value="light">Lighting</option>
                  <option value="drain">Drainage</option>
                  <option value="curb">Curb Damage</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={filters.status} onChange={handleFilterChange}>
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="reported">Reported</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address/Location</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter street, area, or landmark..."
                  value={filters.address}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="datePrepared">Date Prepared</label>
                <input
                  type="date"
                  id="datePrepared"
                  name="datePrepared"
                  value={filters.datePrepared}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reporter">Reporter By (Citizen)</label>
                <input
                  type="text"
                  id="reporter"
                  name="reporter"
                  placeholder="Enter citizen name..."
                  value={filters.reporter}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-search">
                Search
              </button>
              <button type="button" className="btn-clear" onClick={handleClearAll}>
                Clear All
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  )
}
