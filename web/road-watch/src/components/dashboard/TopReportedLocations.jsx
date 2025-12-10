import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../dashboard/styles/TopReportedLocations.css';

const createCustomIcon = (priority) => {
  const colors = {
    high: '#d32f2f',
    medium: '#fbc02d',
    low: '#2e7d32'
  };

  const color = colors[priority] || '#00695c';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background-color: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const TopReportedLocations = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const parsedUser = user ? JSON.parse(user) : null;
    const userEmail = parsedUser?.email;
    const role = parsedUser?.role;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/reports/getAll`)
      .then((res) => {
        console.log("Reports fetched:", res.data);

        // Filter reports for non-admin users
        let reports = res.data;
        if (role !== 'admin') {
          reports = reports.filter(r => r.submittedBy === userEmail);
        }

        // Map reports to location data
        const mapped = reports.map((r, index) => ({
          id: index,
          latitude: parseFloat(r.latitude) || 10.3157,
          longitude: parseFloat(r.longitude) || 123.8854,
          name: r.location || "Unknown",
          reportCount: 1, // you can sum counts per location if needed
          priority: r.status === 'Pending' ? 'medium' : r.status === 'Resolved' ? 'low' : 'high'
        }));

        setLocations(mapped);
      })
      .catch((err) => {
        console.error("Error loading reports:", err);
      });
  }, []);

  const center = [10.3157, 123.8854];

  return (
    <div className="top-reported-locations">
      <div className="map-header">
        <h3 className="chart-title">Top Reported Locations</h3>
      </div>

      <div className="map-container">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              icon={createCustomIcon(location.priority)}
            >
              <Popup>
                <div className="custom-popup">
                  <h4>{location.name}</h4>
                  <p className="report-count">
                    Report Count: <strong>{location.reportCount}</strong>
                  </p>
                  <p className="priority-label">
                    Priority: <span className={`priority-${location.priority}`}>
                      {location.priority.toUpperCase()}
                    </span>
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="map-overlay">
          Interactive Map - Click markers for details
        </div>
      </div>
    </div>
  );
};

export default TopReportedLocations;
