import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import reportService from '../../services/api/reportService';
import './styles/CitizenSubmit.css';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    navigate('/citizen/dashboard');
  };

  const handleSubmit = async (e) => {
        e.preventDefault();

        const user = localStorage.getItem('user');
        const parsedUser = JSON.parse(user);

        // Use email instead of full name
        const email = parsedUser.email;

        // Include lat/lng in the report
        const payload = {
            ...formData,
            latitude: mapPosition?.lat,
            longitude: mapPosition?.lng,
            submittedBy: email  // <-- send email
        };

        const response = await reportService.createReport(payload, email);

        if (response.success) {
            console.log('Report submitted!');
            alert('Report submitted!');
            navigate('/citizen/reports');
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
        <input type="file" accept="image/*" multiple />
      </div>

      {/* Buttons */}
      <div className="cs-buttons">
        <button type="submit"> Submit </button>
        <button type="button" onClick={handleCancel}> Cancel </button>
      </div>
    </form>
  );
};

export default CitizenSubmit;
