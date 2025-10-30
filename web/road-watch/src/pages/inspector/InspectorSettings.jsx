"use client"

import { useState } from "react"
import InspectorHeader from "./ins-components/InspectorHeader"
import InspectorSidebar from "./ins-components/InspectorSidebar"
// import Sidebar from "../../components/common/Sidebar"
import "./styles/InspectorSettings.css"

export default function InspectorSettings() {
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    address: "",
  })

  const [googleAuth, setGoogleAuth] = useState(false)

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditProfile = (e) => {
    e.preventDefault()
    console.log("Profile updated:", personalInfo)
  }

  const handleChangePassword = () => {
    console.log("Change password clicked")
  }

  const handleGoogleAuthToggle = () => {
    setGoogleAuth(!googleAuth)
  }

  return (
    <div className="dashboard-container">
        <InspectorSidebar />
        {/* <Sidebar/> */}
    <div className="dashboard-main">
      <InspectorHeader />
      <div className="dashboard-content">
        <div className="settings-container">
          <h1 className="page-title">Account Settings</h1>

          <div className="settings-section">
            <h2 className="section-title">Personal Information</h2>
            <div className="personal-info-card">
              <div className="avatar-section">
                <div className="avatar-circle">ID</div>
              </div>

              <form onSubmit={handleEditProfile} className="info-form">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactNumber">Contact Number *</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    placeholder="Enter your contact number"
                    value={personalInfo.contactNumber}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    placeholder="Enter your address"
                    value={personalInfo.address}
                    onChange={handlePersonalInfoChange}
                    rows="3"
                    required
                  />
                </div>

                <button type="submit" className="btn-edit-profile">
                  Edit Profile
                </button>
              </form>
            </div>
          </div>

          <div className="settings-section">
            <h2 className="section-title">Security Settings</h2>

            <div className="security-card">
              <div className="security-item">
                <h3>Change Password</h3>
                <button onClick={handleChangePassword} className="btn-change-password">
                  Change Password
                </button>
              </div>
            </div>

            <div className="security-card">
              <div className="security-item">
                <div className="auth-header">
                  <div className="google-icon">🔐</div>
                  <div className="auth-info">
                    <h3>Email Authentication</h3>
                    <p>Google Account</p>
                    <p className="auth-description">Connect your Google account for easy sign-in</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={googleAuth} onChange={handleGoogleAuthToggle} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
