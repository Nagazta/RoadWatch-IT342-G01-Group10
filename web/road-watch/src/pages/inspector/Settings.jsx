import { useState, useEffect } from 'react';
import '../citizen/styles/CitizenSettings.css';
import '../admin/styles/Dashboard.css';
import './styles/InspectorStyles.css';
import ToggleSwitch from '../../components/settings/ToggleSwitch';
import authService from '../../services/api/authService';

const baseURL = `${import.meta.env.VITE_API_URL}/api`;
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
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [googleAuth, setGoogleAuth] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [uploadErr, setUploadErr] = useState('');
  const [userId, setUserId] = useState(null);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Get current user data from localStorage
        const currentUser = authService.getCurrentUser();
        const roleData = authService.getRoleData();

        if (!currentUser || !roleData) {
          setEditError('Unable to load user data. Please login again.');
          setLoading(false);
          return;
        }

        // Set user ID for updates
        const userIdValue = currentUser.id;
        setUserId(userIdValue);

        // Fetch user profile from backend using /api/users/profile
        const token = localStorage.getItem('token');
        const response = await fetch(`${baseURL}/users/profile?userId=${userIdValue}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const userData = await response.json();

        if (userData) {
          // Set form data from user profile
          setName(userData.name || '');
          setEmail(userData.email || '');
          setContact(userData.contact || '');

          // For inspector, get area assignment from roleData
          if (roleData.area_assignment) {
            setAddress(roleData.area_assignment);
          }

          // Check if user has google/supabase ID for google auth toggle
          setGoogleAuth(!!userData.supabaseId);
        } else {
          setEditError('Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setEditError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleProfileEdit = async (e) => {
    e.preventDefault();

    if (!name || !email || !contact) {
      setEditError('Name, email and contact are required.');
      setEditSuccess('');
      return;
    }

    try {
      setEditError('');

      // Prepare update data
      const updateData = {
        id: userId,
        name: name,
        email: email,
        contact: contact,
      };

      // Call API to update profile using /api/users/profile
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseURL}/users/profile?userId=${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();

      if (result.success) {
        setEditSuccess('Profile successfully saved!');

        // Update localStorage user data
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          currentUser.name = name;
          currentUser.email = email;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }

        setTimeout(() => setEditSuccess(''), 3000);
      } else {
        setEditError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setEditError('Failed to save profile changes');
    }
  };

  const handlePasswordSave = async () => {
    // Clear previous errors
    setEditError('');
    setEditSuccess('');

    // Validation
    if (!currentPass.trim()) {
      setEditError('Current password is required');
      return;
    }

    if (!newPass.trim()) {
      setEditError('New password is required');
      return;
    }

    if (newPass.length < 6) {
      setEditError('New password must be at least 6 characters');
      return;
    }

    if (newPass !== confirmPass) {
      setEditError('New passwords do not match');
      return;
    }

    if (currentPass === newPass) {
      setEditError('New password must be different from current password');
      return;
    }

    try {
      // Call API to change password
      const result = await authService.changePassword(userId, currentPass, newPass);

      if (result.success) {
        setEditSuccess('Password changed successfully!');
        setPasswordModalOpen(false);
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');

        setTimeout(() => setEditSuccess(''), 3000);
      } else {
        setEditError(result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setEditError('Failed to change password. Please try again.');
    }
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
    // TODO: Implement profile picture upload to backend
  };

  if (loading) {
    return (
      <div className="citizen-settings inspector-settings-page">
        <div className="inspector-settings-card">
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="citizen-settings inspector-settings-page">
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="inspector-modal-content">
          <h3>Profile Picture</h3>
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="inspector-profile-preview" />
          ) : (
            <div className="inspector-avatar-initials">{getInitials(name || 'IN')}</div>
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
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        setEditError('');
      }}>
        <div className="inspector-modal-content">
          <h3>Change Password</h3>
          <p style={{ marginBottom: '20px', color: '#666' }}>Enter your current password and choose a new one</p>

          <label htmlFor="current-password">Current Password</label>
          <input
            id="current-password"
            type="password"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
            placeholder="Enter current password"
            className="inspector-text-input"
            style={{ marginBottom: '15px' }}
          />

          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="Enter new password"
            className="inspector-text-input"
            style={{ marginBottom: '15px' }}
          />

          <label htmlFor="confirm-password">Confirm New Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Confirm new password"
            className="inspector-text-input"
            style={{ marginBottom: '15px' }}
          />

          {editError && <div className="inspector-alert inspector-alert--error">{editError}</div>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="inspector-btn-primary" type="button" onClick={handlePasswordSave}>
              Save Password
            </button>
            <button
              className="inspector-btn-secondary"
              type="button"
              onClick={() => {
                setPasswordModalOpen(false);
                setCurrentPass('');
                setNewPass('');
                setConfirmPass('');
                setEditError('');
              }}
            >
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
            <div className="inspector-avatar-initials">{getInitials(name || 'IN')}</div>
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

          <label htmlFor="address">Assigned Area</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="inspector-textarea"
            placeholder="Your assigned inspection area"
            disabled
          />
          <p style={{ fontSize: '12px', color: '#666', marginTop: '-8px' }}>
            Contact your administrator to change your assigned area
          </p>

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
            <p>{googleAuth ? 'Connected to Google account' : 'No Google account linked'}</p>
          </div>
          <ToggleSwitch checked={googleAuth} onChange={() => setGoogleAuth(!googleAuth)} disabled />
        </div>
      </div>
    </div>
  );
};

export default Settings;
