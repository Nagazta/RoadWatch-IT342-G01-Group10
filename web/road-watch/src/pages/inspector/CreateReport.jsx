import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import reportService from '../../services/api/reportService';
import '../citizen/styles/CitizenSubmit.css';
import './styles/SubmittedReports.css';

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

const CreateReport = () => {
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
  const [reportList, setReportList] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [errorReports, setErrorReports] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    navigate('/inspector/dashboard');
  };

  const fetchInspectorReports = async (email) => {
    setLoadingReports(true);
    setErrorReports('');
    const response = await reportService.getReportsByEmail(email);
    setLoadingReports(false);
    if (response.success) {
      setReportList(Array.isArray(response.data) ? response.data : []);
    } else {
      setErrorReports('Failed to fetch reports.');
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) return;
    const email = JSON.parse(user).email;
    fetchInspectorReports(email);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const email = parsedUser.email;
    const payload = {
      ...formData,
      latitude: mapPosition?.lat,
      longitude: mapPosition?.lng,
      submittedBy: email
    };
    const response = await reportService.createReport(payload, email);
    if (response.success) {
      alert('Report submitted!');
      setFormData({
        title: '',
        description: '',
        category: '',
        location: '',
        latitude: null,
        longitude: null
      });
      setMapPosition(null);
      fetchInspectorReports(email);
    }
  };

  return (
    <div className="dashboard-container inspector-page">
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

      {/* Submitted Reports Section */}
      <div className="submitted-reports-section">
        <h2 className="submitted-reports-title">Submitted Reports</h2>
        
        {loadingReports ? (
          <div className="submitted-reports-empty">
            <p>Loading reports...</p>
          </div>
        ) : errorReports ? (
          <div className="submitted-reports-error">
            <p>{errorReports}</p>
          </div>
        ) : !reportList.length ? (
          <div className="submitted-reports-empty">
            <p>No reports submitted yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="submitted-reports-table-wrapper">
              <table className="submitted-reports-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Date Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {reportList.map((rep, i) => (
                    <tr key={rep.id || i}>
                      <td className="report-title-cell">{rep.title}</td>
                      <td>{rep.category}</td>
                      <td>{rep.location || '-'}</td>
                      <td>
                        <span className={`status-badge status-${rep.status?.toLowerCase().replace(/\s+/g, '-') || 'pending'}`}>
                          {rep.status || '-'}
                        </span>
                      </td>
                      <td className="date-cell">
                        {rep.dateSubmitted ? new Date(rep.dateSubmitted).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : (rep.createdAt ? new Date(rep.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : '-')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="submitted-reports-cards">
              {reportList.map((rep, i) => (
                <div key={rep.id || i} className="submitted-report-card">
                  <div className="card-header">
                    <h3 className="card-title">{rep.title}</h3>
                    <span className={`status-badge status-${rep.status?.toLowerCase().replace(/\s+/g, '-') || 'pending'}`}>
                      {rep.status || '-'}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="card-row">
                      <span className="card-label">Category:</span>
                      <span className="card-value">{rep.category}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">Location:</span>
                      <span className="card-value">{rep.location || '-'}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">Date:</span>
                      <span className="card-value">
                        {rep.dateSubmitted ? new Date(rep.dateSubmitted).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : (rep.createdAt ? new Date(rep.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : '-')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateReport;
