"use client"
import {
  DashboardIcon,
  ReportsIcon,
  AuditIcon,
  AssignmentIcon,
  SettingsIcon,
  LogoutIcon,
  RoadWatchLogoIcon,
} from "./InspectorIcons"
import { useNavigate } from "react-router-dom"
// import "./styles/InspectorSidebar.css"
import "../styles/InspectorSidebar.css"

export default function InspectorSidebar({ currentPage }) {
  const navigate = useNavigate()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardIcon, path: "/i/d" },
    { id: "search", label: "Search Reports", icon: ReportsIcon, path: "/i/sr" },
    { id: "assigned", label: "Assigned Reports", icon: AuditIcon, path: "/i/ar" },
    { id: "create", label: "Create Report", icon: AssignmentIcon, path: "/i/cr" },
    { id: "settings", label: "Settings", icon: SettingsIcon, path: "/i/s" },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-circle">
          <RoadWatchLogoIcon />
        </div>
        <div className="logo-text">
          <h2>RoadWatch</h2>
          <p>Inspector Dashboard</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon
          return (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">
                <IconComponent />
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <button className="logout-btn">
        <LogoutIcon />
        LOGOUT
      </button>
    </aside>
  )
}
