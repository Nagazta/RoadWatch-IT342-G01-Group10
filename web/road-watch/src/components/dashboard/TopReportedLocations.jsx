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
  const locations = [
    {
      id: 1,
      latitude: 10.3157,
      longitude: 123.8854,
      name: 'Cebu IT Park',
      reportCount: 45,
      priority: 'high'
    },
    {
      id: 2,
      latitude: 10.2950,
      longitude: 123.9019,
      name: 'Ayala Center',
      reportCount: 32,
      priority: 'medium'
    },
    {
      id: 3,
      latitude: 10.3250,
      longitude: 123.8800,
      name: 'Banilad',
      reportCount: 28,
      priority: 'high'
    },
    {
      id: 4,
      latitude: 10.2800,
      longitude: 123.8500,
      name: 'South Road Properties',
      reportCount: 15,
      priority: 'low'
    }
  ];

  const center = [10.3157, 123.8854]; 

  return (
    <div className="top-reported-locations">
      <div className="map-header">
        <h3 className="chart-title">Top Reported Locations</h3>
        <div className="map-legend">
          <span className="legend-badge high">High Priority</span>
        </div>
      </div>
      <div className="map-container">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
                    <strong>{location.reportCount}</strong> reports
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
