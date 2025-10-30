"use client"

import { useState } from "react"
import InspectorSidebar from "./ins-components/InspectorSidebar"
import InspectorHeader from "./ins-components/InspectorHeader"
import InspectorReportsTable from "./ins-components/InspectorReportsTable"
import "./styles/InspectorDashboard.css"

export default function InspectorDashboard() {
  const [sortBy, setSortBy] = useState("date")
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [currentPage, setCurrentPage] = useState(1)

  const reports = [
    {
      id: 1,
      type: "Road",
      title: "Large Pothole on Main Street",
      category: "Pothole",
      address: "Loc. San Remigio, Cebu",
      status: "Pending",
      date: "2025-10-10",
      reporter: "John Smith",
      distance: "0.3 km",
      image: "🛣️",
    },
    {
      id: 2,
      type: "Crack",
      title: "Sidewalk Crack Near School",
      category: "Sidewalk Damage",
      address: "567 Oak Avenue, School District",
      status: "In Progress",
      date: "2024-01-14",
      reporter: "Sarah Johnson",
      distance: "1.2 km",
      image: "🔨",
    },
    {
      id: 3,
      type: "Sign",
      title: "Damaged Street Sign",
      category: "Signage",
      address: "890 Pine Road, Residential",
      status: "Completed",
      date: "2024-01-13",
      reporter: "Mike Davis",
      distance: "2.1 km",
      image: "🚧",
    },
    {
      id: 4,
      type: "Light",
      title: "Broken Street Light",
      category: "Lighting",
      address: "345 Elm Street, Commercial",
      status: "Pending",
      date: "2024-01-12",
      reporter: "Lisa Wilson",
      distance: "0.8 km",
      image: "💡",
    },
    {
      id: 5,
      type: "Road",
      title: "Road Surface Deterioration",
      category: "Road Surface",
      address: "678 Maple Drive, Suburban",
      status: "Reported",
      date: "2024-01-11",
      reporter: "Tom Brown",
      distance: "3.5 km",
      image: "🛣️",
    },
    {
      id: 6,
      type: "Drain",
      title: "Blocked Storm Drain",
      category: "Drainage",
      address: "123 Cedar Lane, Industrial",
      status: "Pending",
      date: "2024-01-10",
      reporter: "Emma Garcia",
      distance: "1.7 km",
      image: "🌊",
    },
    {
      id: 7,
      type: "Hole",
      title: "Deep Pothole Emergency",
      category: "Pothole",
      address: "456 Birch Street, Residential",
      status: "In Progress",
      date: "2024-01-09",
      reporter: "David Lee",
      distance: "0.5 km",
      image: "⚠️",
    },
    {
      id: 8,
      type: "Curb",
      title: "Damaged Curb Section",
      category: "Curb Damage",
      address: "789 Spruce Avenue, Downtown",
      status: "Completed",
      date: "2024-01-08",
      reporter: "Rachel Martinez",
      distance: "2.3 km",
      image: "🔧",
    },
  ]

  return (
    <div className="dashboard-container">
      <InspectorSidebar />
      <div className="dashboard-main">
        <InspectorHeader />
        <div className="dashboard-content">
          <div className="controls-section">
            <div className="sort-controls">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Date</option>
                <option value="status">Status</option>
                <option value="distance">Distance</option>
              </select>
            </div>
            <div className="pagination-controls">
              <label>Items per page:</label>
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                <option value={8}>8</option>
                <option value={16}>16</option>
                <option value={24}>24</option>
              </select>
            </div>
            <div className="total-reports">
              Total Reports: <span>{reports.length}</span>
            </div>
          </div>
          <InspectorReportsTable reports={reports} />
          <div className="pagination-info">Showing: {currentPage}</div>
        </div>
      </div>
    </div>
  )
}
