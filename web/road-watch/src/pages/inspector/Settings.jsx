import { useState } from 'react';
import '../citizen/styles/CitizenSettings.css';
import '../admin/styles/Dashboard.css';
import './styles/InspectorStyles.css';
import ToggleSwitch from '../../components/settings/ToggleSwitch';

const getInitials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="inspector-modal-backdrop">
      <div className="inspector-modal">
        <button className="inspector-modal-close" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const Settings = () => {
  const [name, setName] = useState('Inspector Davis');
  const [email, setEmail] = useState('inspector.davis@email.com');
  const [contact, setContact] = useState('09171234567');
  const [address, setAddress] = useState('IT Park, Cebu City');
  const [googleAuth, setGoogleAuth] = useState(true);
  const [editingPassword, setEditingPassword] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [uploadErr, setUploadErr] = useState('');

  const handleProfileEdit = (e) => {
    e.preventDefault();
    if (!name || !email || !contact || !address) {
      setEditError('All fields are required.');
      setEditSuccess('');
      return;
    }
    setEditError('');
    setEditSuccess('Profile successfully saved!');
    setTimeout(() => setEditSuccess(''), 1500);
  };

  const handlePasswordSave = () => {
    if (!newPass.trim()) {
      setEditError('Password is required');
      return;
    }
    setEditError('');
    setEditSuccess('Password changed!');
    setEditingPassword(false);
    setTimeout(() => setEditSuccess(''), 1500);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadErr('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadErr('Image must be less than 5MB.');
      return;
    }
    setUploadErr('');
    setProfilePic(URL.createObjectURL(file));
  };

  return (
    <div className="citizen-settings inspector-settings-page">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="inspector-modal-content">
          <h3>Profile Picture</h3>
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="inspector-profile-preview" />
          ) : (
            <div className="inspector-avatar-initials">{getInitials(name)}</div>
          )}
          <label htmlFor="profile-upload" className="inspector-btn-secondary" style={{ textAlign: 'center' }}>
            Upload {profilePic ? 'New' : ''} Picture
          </label>
          <input id="profile-upload" type="file" accept="image/*" hidden onChange={handleUpload} />
          {uploadErr && <div className="inspector-alert inspector-alert--error">{uploadErr}</div>}
          <button className="inspector-btn-primary" type="button" onClick={() => setModalOpen(false)}>
            Save
          </button>
        </div>
      </Modal>

      <div className="profile-info inspector-settings-card">
        <h3>Profile Information</h3>
        <p>Update your personal details and contact information</p>
        <div className="avatar inspector-avatar" onClick={() => setModalOpen(true)}>
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="inspector-profile-preview" />
          ) : (
            <div className="inspector-avatar-initials">{getInitials(name)}</div>
          )}
          <button type="button">Change</button>
        </div>

        <form onSubmit={handleProfileEdit} className="inspector-profile-form">
          <label htmlFor="fullname">Full Name</label>
          <input
            id="fullname"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="inspector-text-input"
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="inspector-text-input"
          />

          <label htmlFor="contactnum">Contact Number</label>
          <input
            id="contactnum"
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="inspector-text-input"
          />

          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="inspector-textarea"
          />

          {editError && <div className="inspector-alert inspector-alert--error">{editError}</div>}
          {editSuccess && <div className="inspector-alert inspector-alert--success">{editSuccess}</div>}

          <button type="submit" className="save-changes">
            Save Changes
          </button>
        </form>
      </div>

      <div className="account-security inspector-settings-card">
        <h3>Account Security</h3>
        <p>Manage your password and security settings</p>
        <div className="password">
          <div>
            <h4>Password</h4>
            <p>Keep your account secure with a strong password</p>
          </div>
          {editingPassword ? (
            <div className="inspector-password-actions">
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="New password..."
                className="inspector-text-input"
              />
              <button type="button" className="inspector-btn-primary" onClick={handlePasswordSave}>
                Save
              </button>
              <button
                type="button"
                className="inspector-btn-secondary"
                onClick={() => {
                  setEditingPassword(false);
                  setNewPass('');
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" className="inspector-btn-secondary" onClick={() => setEditingPassword(true)}>
              Change Password
            </button>
          )}
        </div>
        <hr />
        <div className="toggle-preference">
          <div>
            <h4>Google Sign-In</h4>
            <p>Connect your Google account for seamless access</p>
          </div>
          <ToggleSwitch checked={googleAuth} onChange={() => setGoogleAuth(!googleAuth)} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
