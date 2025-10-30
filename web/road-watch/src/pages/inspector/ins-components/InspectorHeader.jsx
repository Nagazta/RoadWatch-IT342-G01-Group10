import { BellIcon, ChevronDownIcon, UserCircleIcon } from "./InspectorIcons"
import "../styles/InspectorHeader.css"

export default function InspectorHeader() {
  return (
    <header className="dashboard-header">
      <h1>Inspector Dashboard</h1>
      <div className="header-actions">
        <button className="notification-btn">
          <BellIcon />
        </button>
        <div className="user-profile">
          <UserCircleIcon />
          <span className="user-name">Inspector Davis</span>
          <button className="dropdown-btn">
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </header>
  )
}
