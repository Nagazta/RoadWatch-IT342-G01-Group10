import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import reportService from '../../services/api/reportService';
import './styles/CitizenSubmit.css';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Custom component for picking a location
const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    }
  });

  return position === null ? null : (
    <Marker position={position} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] })} />
  );
};

const CitizenSubmit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    latitude: null,
    longitude: null
  });

  const [mapPosition, setMapPosition] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate: max 5 files
    if (files.length > 5) {
      alert('You can only upload up to 5 images');
      return;
    }

    // Validate: each file max 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    const invalidFiles = files.filter(file => file.size > maxSize);
    
    if (invalidFiles.length > 0) {
      alert('Each image must be less than 5MB');
      return;
    }

    // Validate: only image files
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const invalidTypes = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidTypes.length > 0) {
      alert('Only JPEG and PNG images are allowed');
      return;
    }

    setSelectedFiles(files);

    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the removed URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const uploadImages = async (reportId, files) => {
    const user = localStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const token = parsedUser.token || localStorage.getItem('token');

    const formData = new FormData();
    
    // Add all image files
    files.forEach(file => {
      formData.append('images', file);
    });

    console.log('📤 Uploading to:', `${API_URL}/api/reports/${reportId}/images`);
    console.log('📦 FormData contains', files.length, 'files');

    const response = await fetch(`${API_URL}/api/reports/${reportId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server response:', errorText);
      throw new Error(`Failed to upload images: ${response.status} ${errorText}`);
    }

    return await response.json();
  };

  const handleCancel = () => {
    // Clean up preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    navigate('/citizen/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = localStorage.getItem('user');
      const parsedUser = JSON.parse(user);
      const email = parsedUser.email;

      // Step 1: Create the report
      const payload = {
        ...formData,
        latitude: mapPosition?.lat,
        longitude: mapPosition?.lng,
        submittedBy: email
      };

      const response = await reportService.createReport(payload, email);

      if (response.success) {
        const reportId = response.data.id;
        
        console.log('✅ Report created with ID:', reportId);

        // Step 2: Upload images if any were selected
        if (selectedFiles.length > 0) {
          try {
            console.log(`📤 Uploading ${selectedFiles.length} images...`);
            await uploadImages(reportId, selectedFiles);
            console.log('✅ Images uploaded successfully');
          } catch (imageError) {
            console.error('❌ Failed to upload images:', imageError);
            alert('Report created but some images failed to upload');
          }
        }

        // Clean up preview URLs
        previewUrls.forEach(url => URL.revokeObjectURL(url));

        console.log('Report submitted!');
        alert('Report submitted successfully!');
        navigate('/citizen/reports');
      } else {
        alert('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('An error occurred while submitting the report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="citizen-submit" onSubmit={handleSubmit}>
      <div className="cs-header">
        <h2> Submit a New Report </h2>
        <p> Help improve road safety in your community by reporting damage or hazards </p>
      </div>

      {/* Report Title */}
      <div className="cs-input">
        <h4> Report Title </h4>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Brief description of the issue (e.g., Large pothole on Main Street)"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* Report Description */}
      <div className="cs-input">
        <h4> Description </h4>
        <input
          id="description"
          name="description"
          type="text"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      {/* Report Category */}
      <div className="cs-input">
        <h4> Category </h4>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
          required
        >
          <option value=""> </option>
          <option value="Pothole"> Pothole </option>
          <option value="Flooding"> Flooding </option>
          <option value="Debris"> Debris </option>
          <option value="Crack"> Crack </option>
          <option value="Other"> Other </option>
        </select>
      </div>

      {/* Report Location */}
      <div className="cs-input">
        <h4> Location </h4>
        <input
          id="location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter street address or landmark"
          required
        />

        <p>Click on the map to pick the exact location:</p>
        <div className="map-wrapper" style={{ height: '300px', marginBottom: '16px' }}>
          <MapContainer
            center={[10.3157, 123.8854]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationPicker position={mapPosition} setPosition={setMapPosition} />
          </MapContainer>
        </div>

        {mapPosition && (
          <p>
            Selected Coordinates: Latitude {mapPosition.lat.toFixed(6)}, Longitude {mapPosition.lng.toFixed(6)}
          </p>
        )}
      </div>

      {/* Report Images */}
      <div className="cs-input">
        <h4> Photos </h4>
        <p> Upload up to 5 photos (JPEG/PNG, max 5MB each) </p>
        <input 
          type="file" 
          accept="image/jpeg,image/jpg,image/png" 
          multiple 
          onChange={handleFileChange}
          disabled={isSubmitting}
        />

        {/* Image Previews */}
        {previewUrls.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            {previewUrls.map((url, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img 
                  src={url} 
                  alt={`Preview ${index + 1}`} 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    objectFit: 'cover', 
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }} 
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        {selectedFiles.length > 0 && (
          <p style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
            {selectedFiles.length} image(s) selected
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="cs-buttons">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <button type="button" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CitizenSubmit;
