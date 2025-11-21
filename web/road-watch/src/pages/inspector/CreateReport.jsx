import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import reportService from '../../services/api/reportService'; 

// Import necessary styles
import '../admin/styles/Dashboard.css';
import '../citizen/styles/CitizenSubmit.css';
import './styles/InspectorStyles.css';

const categories = ['Pothole', 'Crack', 'Debris', 'Flooding', 'Other'];
const MAX_PHOTOS = 5;
const MAX_SIZE_MB = 5; // 5MB limit

// Custom component for picking a location
const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    }
  });

  return position === null ? null : (
    <Marker 
      position={position} 
      icon={L.icon({ 
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', 
        iconSize: [25, 41], 
        iconAnchor: [12, 41] 
      })} 
    />
  );
};

const CreateReport = () => {
  const navigate = useNavigate(); 

  // 1. State for Form Inputs 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [locationText, setLocationText] = useState(''); 

  // 2. State for Map Position (precise coordinates)
  const [mapPosition, setMapPosition] = useState(null); 

  // 3. State for Files and Status
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handler for standard text/select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update the corresponding state based on the input name
    if (name === 'title') setTitle(value);
    if (name === 'description') setDescription(value);
    if (name === 'category') setCategory(value);
    if (name === 'locationText') setLocationText(value); 
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + photos.length > MAX_PHOTOS) {
      setError(`You can upload up to ${MAX_PHOTOS} photos.`);
      return;
    }
    
    for (const file of files) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Each photo must be under ${MAX_SIZE_MB}MB.`);
        return;
      }
    }
    
    setPhotos([...photos, ...files]);
    setError('');
    e.target.value = ''; // Clear the file input
  };

  const handleRemovePhoto = (idx) => {
    setPhotos(photos.filter((_, i) => i !== idx));
    if (photos.length - 1 > 0) {
      setError('');
    }
  };

  const handleCancel = () => {
    // Navigate back to the inspector's dashboard/main reports page
    navigate('/inspector/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    // --- Validation ---
    if (!title || !category || !locationText) {
      setError('Please fill all required fields (Title, Category, and Location Text).');
      return;
    }

    if (!mapPosition) {
      setError('Please click on the map to set the precise location.');
      return;
    }

    if (photos.length === 0) {
      setError('Please upload at least 1 photo.');
      return;
    }
    // --- End Validation ---
    
    try {
        // 1. Fetch User Data from Local Storage (Matching CitizenSubmit logic)
        const user = localStorage.getItem('user');
        const parsedUser = JSON.parse(user || '{}');
        // Use email for submission reference
        const email = parsedUser.email; 

        if (!email) {
            setError('User authentication data not found. Please log in again.');
            return;
        }

        // 2. Prepare Metadata Payload (Matching CitizenSubmit data structure)
        const metadataPayload = {
            title,
            description,
            category,
            location: locationText,
            latitude: mapPosition.lat,
            longitude: mapPosition.lng,
            submittedBy: email, // <-- send email
        };

        // 3. Prepare FormData for API (Metadata + Files)
        const data = new FormData();
        
        // Append Metadata
        Object.keys(metadataPayload).forEach(key => {
            // Ensure values are not null/undefined before appending
            if (metadataPayload[key] !== null && metadataPayload[key] !== undefined) {
                data.append(key, metadataPayload[key]);
            }
        });
        
        // Append Photos
        photos.forEach((photo) => {
            data.append('photos', photo, photo.name); // 'photos' is the expected field name for files
        });

        // 4. API Call (Matching CitizenSubmit logic)
        const response = await reportService.createReport(data, email); 

        if (response?.success) {
            console.log('Report submitted!');
            // alert('Report submitted!'); // Removed alert in favor of success message
            setSuccess('Report submitted successfully!');
            
            // Clear form (optional but good practice)
            setTitle('');
            setDescription('');
            setCategory('');
            setLocationText('');
            setMapPosition(null);
            setPhotos([]);

            // Navigate to the reports list (e.g., inspector reports page)
            setTimeout(() => navigate('/inspector/reports'), 1000); 

        } else {
            // Handle API errors
            setError(response?.message || 'Failed to submit report. Please check server status.');
            console.error('API submission failed:', response);
        }

    } catch (apiError) {
      console.error('Report submission error:', apiError);
      setError('A network error occurred or the API is unreachable. Please try again.');
    }
  };

  return (
    <div className="dashboard-container inspector-page">
      <form className="citizen-submit inspector-form-card" onSubmit={handleSubmit}>
        <div className="cs-header">
          <h2>Create New Report 🚧</h2>
          <p>Match the citizen report submission experience for inspectors.</p>
        </div>

        {/* Report Title */}
        <div className="cs-input">
          <h4>
            Report Title <span className="required">*</span>
          </h4>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Short descriptive title"
            value={title}
            onChange={handleChange}
            required
            className="inspector-text-input"
          />
        </div>

        {/* Report Description */}
        <div className="cs-input">
          <h4>Description</h4>
          <textarea
            id="description"
            name="description"
            placeholder="Add any details (optional)"
            value={description}
            onChange={handleChange}
            className="inspector-textarea"
          />
        </div>

        {/* Report Category */}
        <div className="cs-input">
          <h4>
            Category <span className="required">*</span>
          </h4>
          <select
            id="category"
            name="category"
            value={category}
            onChange={handleChange}
            required
            className="inspector-select-input"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Report Location (Text + Map) */}
        <div className="cs-input">
          <h4>
            Location <span className="required">*</span>
          </h4>
          <input
            id="locationText"
            name="locationText"
            type="text"
            value={locationText}
            onChange={handleChange}
            placeholder="Enter street address or landmark"
            required
            className="inspector-text-input"
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
            <p className="selected-coordinates">
              Selected Coordinates: **Latitude** {mapPosition.lat.toFixed(6)}, **Longitude** {mapPosition.lng.toFixed(6)}
            </p>
          )}
        </div>

        {/* Report Images */}
        <div className="cs-input">
          <h4>
            Photos <span className="required">*</span>
          </h4>
          <p>Upload up to {MAX_PHOTOS} photos (JPEG/PNG, max {MAX_SIZE_MB}MB each)</p>
          <input type="file" accept="image/*" multiple onChange={handlePhotoChange} />
          
          {photos.length > 0 && (
            <div className="inspector-photo-grid">
              {photos.map((photo, index) => (
                <div key={`${photo.name}-${index}`} className="inspector-photo-thumb">
                  <img src={URL.createObjectURL(photo)} alt="Preview" />
                  <button
                    type="button"
                    aria-label="Remove Photo"
                    className="inspector-photo-remove"
                    onClick={() => handleRemovePhoto(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Messages */}
        {error && <div className="inspector-alert inspector-alert--error">⚠️ {error}</div>}
        {success && (
          <div className="inspector-alert inspector-alert--success">✅ {success}</div>
        )}

        {/* Buttons */}
        <div className="cs-buttons">
          <button type="submit" className="inspector-btn-primary">
            Submit Report
          </button>
          <button type="button" className="inspector-btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateReport;