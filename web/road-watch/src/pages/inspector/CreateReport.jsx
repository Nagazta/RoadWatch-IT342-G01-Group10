import { useState } from 'react';
import '../admin/styles/Dashboard.css';
import '../citizen/styles/CitizenSubmit.css';
import './styles/InspectorStyles.css';

const categories = ['Pothole', 'Crack', 'Debris', 'Flooding', 'Other'];
const MAX_PHOTOS = 5;
const MAX_SIZE_MB = 5;

const CreateReport = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
  };

  const handleRemovePhoto = (idx) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    if (!title || !category || !location) {
      setError('Please fill all required fields.');
      return;
    }
    if (photos.length === 0) {
      setError('Please upload at least 1 photo.');
      return;
    }
    setError('');
    setSuccess('Report created successfully (demo only)!');
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setPhotos([]);
  };

  return (
    <div className="dashboard-container inspector-page">
      <form className="citizen-submit inspector-form-card" onSubmit={handleSubmit}>
        <div className="cs-header">
          <h2>Create New Report</h2>
          <p>Match the citizen report submission experience for inspectors.</p>
        </div>

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
            onChange={(e) => setTitle(e.target.value)}
            required
            className="inspector-text-input"
          />
        </div>

        <div className="cs-input">
          <h4>Description</h4>
          <textarea
            id="description"
            name="description"
            placeholder="Add any details (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="inspector-textarea"
          />
        </div>

        <div className="cs-input">
          <h4>
            Category <span className="required">*</span>
          </h4>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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

        <div className="cs-input">
          <h4>
            Location <span className="required">*</span>
          </h4>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="Enter street address or landmark"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="inspector-text-input"
          />
        </div>

        <div className="cs-input">
          <h4>
            Photos <span className="required">*</span>
          </h4>
          <p>Upload up to 5 photos (JPEG/PNG, max 5MB each)</p>
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

        {error && <div className="inspector-alert inspector-alert--error">{error}</div>}
        {success && (
          <div className="inspector-alert inspector-alert--success">{success}</div>
        )}

        <div className="cs-buttons">
          <button type="submit">Submit</button>
          <button type="button" className="inspector-btn-secondary" onClick={() => setPhotos([])}>
            Clear Photos
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateReport;
