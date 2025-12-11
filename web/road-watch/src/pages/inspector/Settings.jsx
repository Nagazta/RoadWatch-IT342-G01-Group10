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
  // State
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [username, setUsername] = useState('');
  const [googleAuth, setGoogleAuth] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [uploadErr, setUploadErr] = useState('');

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user) {
        setEditError('User not authenticated');
        setLoading(false);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiUrl}/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      
      console.log('📥 Profile data:', data);

      // Set state with fetched data
      setUserId(data.id);
      setName(data.name || '');
      setEmail(data.email || '');
      setContact(data.contact || '');
      setUsername(data.username || '');
      setGoogleAuth(!!data.supabaseId); // Has Google auth if supabaseId exists

      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching profile:', err);
      setEditError('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleProfileEdit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');

    // Validation
    if (!name || !email || !contact) {
      setEditError('Name, email, and contact are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_BASE_URL;

      const response = await fetch(`${apiUrl}/api/users/updateBy/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: userId,
          name,
          email,
          contact,
          username,
          // Don't send password unless changing it
          isActive: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        name: updatedUser.name,
        email: updatedUser.email,
        contact: updatedUser.contact,
        username: updatedUser.username
      }));

      setEditSuccess('Profile successfully saved!');
      setTimeout(() => setEditSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      setEditError(err.message);
    }
  };

  const handlePasswordSave = async () => {
    setEditError('');
    setEditSuccess('');

    // Validation
    if (!currentPassword || !newPass || !confirmPass) {
      setEditError('All password fields are required');
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

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_BASE_URL;

      // First verify current password by attempting login
      const loginResponse = await fetch(`${apiUrl}/api/auth/login-inspector`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: currentPassword
        })
      });

      if (!loginResponse.ok) {
        throw new Error('Current password is incorrect');
      }

      // Now update with new password
      const updateResponse = await fetch(`${apiUrl}/api/users/updateBy/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: userId,
          name,
          email,
          contact,
          username,
          password: newPass, // Send new password
          isActive: true
        })
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || 'Failed to update password');
      }

      setEditSuccess('Password changed successfully!');
      setEditingPassword(false);
      setCurrentPassword('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setEditSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error changing password:', err);
      setEditError(err.message);
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
    // TODO: Upload to server (implement image upload endpoint)
  };

  // Loading state
  if (loading) {
    return (
      <div className="citizen-settings inspector-settings-page">
        <p>Loading profile...</p>
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
            required
          />

          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="inspector-text-input"
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="inspector-text-input"
            required
            disabled // Email shouldn't be changed
          />

          <label htmlFor="contactnum">Contact Number</label>
          <input
            id="contactnum"
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="inspector-text-input"
            required
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
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="inspector-text-input"
              />
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="New password (min 6 characters)"
                className="inspector-text-input"
              />
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm new password"
                className="inspector-text-input"
              />
              <button type="button" className="inspector-btn-primary" onClick={handlePasswordSave}>
                Save Password
              </button>
              <button
                type="button"
                className="inspector-btn-secondary"
                onClick={() => {
                  setEditingPassword(false);
                  setCurrentPassword('');
                  setNewPass('');
                  setConfirmPass('');
                  setEditError('');
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
            <p>{googleAuth ? 'Connected to Google account' : 'Not connected to Google'}</p>
          </div>
          <ToggleSwitch 
            checked={googleAuth} 
            onChange={() => setGoogleAuth(!googleAuth)}
            disabled={true} // Can't toggle Google auth from settings
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;