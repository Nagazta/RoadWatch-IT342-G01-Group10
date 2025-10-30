"use client"

import { useState } from "react"
import InspectorHeader from "./ins-components/InspectorHeader"
import InspectorSidebar from "./ins-components/InspectorSidebar"
import "./styles/InspectorCreateReport.css"

export default function InspectorCreateReport() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    address: "",
    photos: [],
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files].slice(0, 5),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Report submitted:", formData)
  }

  return (
    <div className="dashboard-container">
        <InspectorSidebar />
    <div className="dashboard-main">
      <InspectorHeader />
      <div className="dashboard-content">
        <div className="create-report-container">
          <h1 className="page-title">Create Report</h1>
          <div className="form-header">
            <h2>Submit a New Report</h2>
            <p>Help improve road safety in your community by reporting damage or hazards</p>
          </div>

          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-group">
              <label htmlFor="title">Report Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Brief description of the issue (e.g., Large pothole on Main Street)"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <span className="char-count">{formData.title.length}/100</span>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                placeholder="Provide detailed information about the issue"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                required
              />
              <span className="char-count">{formData.description.length}/500</span>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select id="category" name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="">Select damage type...</option>
                <option value="pothole">Pothole</option>
                <option value="crack">Crack</option>
                <option value="sign">Sign Damage</option>
                <option value="light">Lighting</option>
                <option value="drain">Drainage</option>
                <option value="curb">Curb Damage</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <div className="location-controls">
                <button type="button" className="btn-add-location">
                  📍 Add Location
                </button>
                <button type="button" className="btn-view-map">
                  View Map
                </button>
              </div>
              <input
                type="text"
                name="address"
                placeholder="Enter street address or coordinates"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="photos">Photos</label>
              <p className="photo-info">Upload up to 5 photos (JPG, PNG, max 5MB each)</p>
              <div className="photo-upload-area">
                <input
                  type="file"
                  id="photos"
                  name="photos"
                  multiple
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                />
                <label htmlFor="photos" className="upload-label">
                  <div className="upload-icon">📸</div>
                  <p>Click to upload photos</p>
                  <p className="upload-hint">or drag and drop here</p>
                </label>
              </div>
              {formData.photos.length > 0 && (
                <div className="photos-preview">
                  <p>{formData.photos.length} photo(s) selected</p>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                Submit Report
              </button>
              <button type="button" className="btn-cancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
    
  )
}
