import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import reportService from '../../services/api/reportService';
import '../citizen/styles/CitizenSubmit.css';

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
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setUploadError('');

    // Validation
    if (files.length > 5) {
      setUploadError('Maximum 5 images allowed');
      return;
    }

    // Validate each file
    const validFiles = [];
    const previewUrls = [];

    for (const file of files) {
      // Check file type
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        setUploadError('Only JPEG and PNG images are allowed');
        continue;
      }

      // Check file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`${file.name} is larger than 5MB`);
        continue;
      }

      validFiles.push(file);
      previewUrls.push(URL.createObjectURL(file));
    }

    setSelectedImages(validFiles);
    setImagePreviewUrls(previewUrls);
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviewUrls.filter((_, i) => i !== index);

    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviewUrls[index]);

    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviews);
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
    setIsUploading(true);
    setUploadError('');

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

      if (!response.success) {
        setUploadError('Failed to create report');
        setIsUploading(false);
        return;
      }

      // Step 2: Upload images if any were selected
      if (selectedImages.length > 0) {
        const reportId = response.data.id;
        const imageUploadResponse = await reportService.uploadReportImages(reportId, selectedImages);

        if (!imageUploadResponse.success) {
          setUploadError('Report created but failed to upload images: ' + imageUploadResponse.error);
          setIsUploading(false);
          return;
        }
      }

      // Success!
      alert(selectedImages.length > 0 ? 'Report and images submitted successfully!' : 'Report submitted successfully!');

      // Clear form
      setFormData({
        title: '',
        description: '',
        category: '',
        location: '',
        latitude: null,
        longitude: null
      });
      setMapPosition(null);

      // Clear images
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      setSelectedImages([]);
      setImagePreviewUrls([]);

      // Refresh report list
      fetchInspectorReports(email);

    } catch (error) {
      console.error('Submit error:', error);
      setUploadError('An error occurred during submission');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
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
            accept="image/jpeg,image/png,image/jpg"
            multiple
            onChange={handleImageSelect}
          />

          {uploadError && (
            <div style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>
              {uploadError}
            </div>
          )}

          {/* Image Previews */}
          {imagePreviewUrls.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <p style={{ fontWeight: '500', marginBottom: '8px' }}>Selected Images ({selectedImages.length}/5):</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} style={{ position: 'relative', width: '120px' }}>
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #e3e7f1'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        lineHeight: '1',
                        fontWeight: 'bold'
                      }}
                    >
                      ×
                    </button>
                    <p style={{
                      fontSize: '11px',
                      marginTop: '4px',
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {selectedImages[index].name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Buttons */}
        <div className="cs-buttons">
          <button type="submit" disabled={isUploading}>
            {isUploading ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button" onClick={handleCancel} disabled={isUploading}>
            Cancel
          </button>
        </div>
      </form>
      <div style={{ maxWidth: '950px', margin: '32px auto', padding: '0 1vw' }}>
        <h3>Submitted Reports</h3>
        {loadingReports ? (
          <p>Loading reports...</p>
        ) : errorReports ? (
          <p style={{ color: 'red' }}>{errorReports}</p>
        ) : !reportList.length ? (
          <p>No reports submitted yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse', border: '1px solid #d6dcf0' }}>
              <thead style={{ background: '#f5f8fc' }}>
                <tr>
                  <th style={{ padding: '10px 16px', borderBottom: '1px solid #e3e7f1' }}>Title</th>
                  <th style={{ padding: '10px 16px', borderBottom: '1px solid #e3e7f1' }}>Category</th>
                  <th style={{ padding: '10px 16px', borderBottom: '1px solid #e3e7f1' }}>Location</th>
                  <th style={{ padding: '10px 12px', borderBottom: '1px solid #e3e7f1' }}>Status</th>
                  <th style={{ padding: '10px 12px', borderBottom: '1px solid #e3e7f1' }}>Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {reportList.map((rep, i) => (
                  <tr key={rep.id || i}>
                    <td style={{ padding: '6px 16px', borderBottom: '1px solid #e3e7f1' }}>{rep.title}</td>
                    <td style={{ padding: '6px 16px', borderBottom: '1px solid #e3e7f1' }}>{rep.category}</td>
                    <td style={{ padding: '6px 16px', borderBottom: '1px solid #e3e7f1' }}>{rep.location || '-'}</td>
                    <td style={{ padding: '6px 12px', borderBottom: '1px solid #e3e7f1' }}>{rep.status || '-'}</td>
                    <td style={{ padding: '6px 12px', borderBottom: '1px solid #e3e7f1' }}>{rep.dateSubmitted || rep.createdAt || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateReport;
