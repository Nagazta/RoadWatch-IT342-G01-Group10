import { useState, useEffect } from 'react';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [googleAuth, setGoogleAuth] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [uploadErr, setUploadErr] = useState('');
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setContact(user.contact || '');
      setAddress(user.address || '');
    }
  }, []);

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

  const handlePasswordChange = () => {
    setPasswordError('');
    
    if (!currentPassword.trim()) {
      setPasswordError('Current password is required');
      return;
    }
    if (!newPassword.trim()) {
      setPasswordError('New password is required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    // TODO: Call backend API to change password with verification
    setPasswordSuccess('Password changed successfully!');
    setPasswordError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setPasswordSuccess('');
      setPasswordModalOpen(false);
    }, 1500);
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

      <Modal open={passwordModalOpen} onClose={() => {
        setPasswordModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
        setPasswordSuccess('');
      }}>
        <div className="inspector-modal-content">
          <h3>Change Password</h3>
          <label htmlFor="current-pass">Current Password</label>
          <input
            id="current-pass"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="inspector-text-input"
          />
          
          <label htmlFor="new-pass">New Password</label>
          <input
            id="new-pass"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="inspector-text-input"
          />
          
          <label htmlFor="confirm-pass">Confirm Password</label>
          <input
            id="confirm-pass"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="inspector-text-input"
          />
          
          {passwordError && <div className="inspector-alert inspector-alert--error">{passwordError}</div>}
          {passwordSuccess && <div className="inspector-alert inspector-alert--success">{passwordSuccess}</div>}
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button className="inspector-btn-primary" type="button" onClick={handlePasswordChange}>
              Change Password
            </button>
            <button className="inspector-btn-secondary" type="button" onClick={() => {
              setPasswordModalOpen(false);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setPasswordError('');
            }}>
              Cancel
            </button>
          </div>
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
          <button type="button" className="inspector-btn-secondary" onClick={() => setPasswordModalOpen(true)}>
            Change Password
          </button>
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
