import './styles/CitizenSettings.css';
import { useState, useEffect } from 'react';
import { UserCircleIcon, UploadIcon } from '../../components/common/Icons';
import authService from '../../services/api/authService';
import ToggleSwitch from '../../components/settings/ToggleSwitch';

const CitizenSettings = () => {
    const [loading, setLoading] = useState(true);
    const [originalUser, setOriginalUser] = useState({});
    const [currentUser, setCurrentUser] = useState({
        contact: '',
        email: '',
        id: 0,
        name: '',
        role: '',
        supabaseId: '',
        username: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Password change state
    const [changingPassword, setChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Not authenticated');
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
            console.log('📥 Fetched profile:', data);

            const userProfile = {
                id: data.id,
                name: data.name || '',
                email: data.email || '',
                contact: data.contact || '',
                username: data.username || '',
                role: data.role || '',
                supabaseId: data.supabaseId || ''
            };

            setOriginalUser(userProfile);
            setCurrentUser(userProfile);
            setLoading(false);
        } catch (err) {
            console.error('❌ Error fetching profile:', err);
            setError('Failed to load profile data');
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setError('');
        setSuccess('');

        // Validation
        if (!currentUser.name || !currentUser.contact) {
            setError('Name and contact number are required');
            return;
        }

        // Check if anything changed
        if (JSON.stringify(currentUser) === JSON.stringify(originalUser)) {
            setError('No changes made');
            return;
        }

        if (!window.confirm('Are you sure you want to save changes?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_BASE_URL;

            const response = await fetch(`${apiUrl}/api/users/updateBy/${currentUser.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentUser.id,
                    name: currentUser.name.trim(),
                    email: currentUser.email,
                    contact: currentUser.contact.trim(),
                    username: currentUser.username,
                    isActive: true
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update profile');
            }

            const updatedUser = await response.json();
            console.log('✅ Profile updated:', updatedUser);

            // Update localStorage
            const storedUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({
                ...storedUser,
                name: updatedUser.name,
                contact: updatedUser.contact,
                username: updatedUser.username
            }));

            setOriginalUser(currentUser);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('❌ Error updating profile:', err);
            setError(err.message);
        }
    };

    const handlePasswordChange = async () => {
        setPasswordError('');
        setSuccess('');

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('All password fields are required');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            const token = localStorage.getItem('token');

            // First verify current password
            const loginResponse = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: currentUser.email,
                    password: currentPassword
                })
            });

            if (!loginResponse.ok) {
                throw new Error('Current password is incorrect');
            }

            // Update password
            const updateResponse = await fetch(`${apiUrl}/api/users/updateBy/${currentUser.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: currentUser.id,
                    name: currentUser.name,
                    email: currentUser.email,
                    contact: currentUser.contact,
                    username: currentUser.username,
                    password: newPassword,
                    isActive: true
                })
            });

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();
                throw new Error(errorData.error || 'Failed to update password');
            }

            setSuccess('Password changed successfully!');
            setChangingPassword(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('❌ Error changing password:', err);
            setPasswordError(err.message);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmText = 'DELETE';
        const userInput = prompt(
            `This action cannot be undone. All your data will be permanently deleted.\n\nType "${confirmText}" to confirm:`
        );

        if (userInput !== confirmText) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_BASE_URL;

            const response = await fetch(`${apiUrl}/api/users/deleteBy/${currentUser.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            alert('Your account has been deleted successfully.');
            localStorage.clear();
            window.location.href = '/';
        } catch (err) {
            console.error('❌ Error deleting account:', err);
            setError('Failed to delete account. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="citizen-settings">
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="citizen-settings">
            {error && (
                <div style={{ 
                    padding: '12px', 
                    marginBottom: '20px', 
                    backgroundColor: '#fee', 
                    color: '#c33', 
                    borderRadius: '8px' 
                }}>
                    {error}
                </div>
            )}
            {success && (
                <div style={{ 
                    padding: '12px', 
                    marginBottom: '20px', 
                    backgroundColor: '#efe', 
                    color: '#2a7', 
                    borderRadius: '8px' 
                }}>
                    {success}
                </div>
            )}

            <div className="profile-info">
                <h3>Profile Information</h3>
                <p>Update your personal details and contact information</p>

                <div className="avatar">
                    <UserCircleIcon/>
                    <button><UploadIcon/> Change</button>
                </div>

                <label htmlFor="name">Full Name</label>
                <input
                    id="name" 
                    name="name"
                    type="text" 
                    placeholder="Maria Santos"
                    value={currentUser.name}
                    onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                    onBlur={() => setCurrentUser(prev => ({...prev, name: prev.name.trimEnd()}))}
                />

                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    placeholder="maria.santos@example.com" 
                    value={currentUser.email} 
                    disabled
                />
                <p className="cannot-change">Email cannot be changed</p>

                <label htmlFor="contact">Contact Number</label>
                <input 
                    id="contact"
                    name="contact"
                    type="text" 
                    placeholder="09123456789"
                    value={currentUser.contact}
                    onChange={(e) => setCurrentUser({...currentUser, contact: e.target.value})}
                    onBlur={() => setCurrentUser(prev => ({...prev, contact: prev.contact.trimEnd()}))}
                />

                <button className="save-changes" onClick={handleSave}>Save Changes</button>
            </div>

            <div className="notification-preferences">
                <h3>Notification Preferences</h3>
                <p>Choose how you want to receive updates about your reports</p>

                <div className="toggle-preference">
                    <div>
                        <h4>Email Notifications</h4>
                        <p>Receive updates via email</p>
                    </div>
                    <ToggleSwitch />
                </div>
                <hr/>
                <div className="toggle-preference">
                    <div>
                        <h4>SMS Notifications</h4>
                        <p>Receive updates via text message</p>
                    </div>
                    <ToggleSwitch />
                </div>
                <hr/>
                <div className="toggle-preference">
                    <div>
                        <h4>App Push Notifications</h4>
                        <p>Receive push notifications in the app</p>
                    </div>
                    <ToggleSwitch />
                </div>
            </div>

            <div className="account-security">
                <h3>Account Security</h3>
                <p>Manage your password and security settings</p>

                <div className="password">
                    <div>
                        <h4>Password</h4>
                        <p>Keep your account secure with a strong password</p>
                    </div>
                    {!changingPassword ? (
                        <button onClick={() => setChangingPassword(true)}>Change Password</button>
                    ) : (
                        <div style={{ marginTop: '16px' }}>
                            <input
                                type="password"
                                placeholder="Current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                style={{ marginBottom: '8px', width: '100%' }}
                            />
                            <input
                                type="password"
                                placeholder="New password (min 6 characters)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ marginBottom: '8px', width: '100%' }}
                            />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ marginBottom: '8px', width: '100%' }}
                            />
                            {passwordError && (
                                <p style={{ color: '#c33', fontSize: '14px', marginBottom: '8px' }}>
                                    {passwordError}
                                </p>
                            )}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={handlePasswordChange}>Save Password</button>
                                <button 
                                    onClick={() => {
                                        setChangingPassword(false);
                                        setCurrentPassword('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                        setPasswordError('');
                                    }}
                                    style={{ backgroundColor: '#666' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <hr/>
                <div className="toggle-preference">
                    <div>
                        <h4>Two-Factor Authentication</h4>
                        <p>Add an extra layer of security to your account</p>
                    </div>
                    <ToggleSwitch />
                </div>
            </div>

            <div className="privacy-settings">
                <h3>Privacy Settings</h3>
                <p>Control your data sharing and privacy preferences</p>

                <div className="toggle-preference">
                    <div>
                        <h4>Location Sharing</h4>
                        <p>Enable GPS auto-location for reports</p>
                    </div>
                    <ToggleSwitch />
                </div>
            </div>

            <div className="danger-zone"> 
                <h3>Danger Zone</h3>
                <p>Irreversible actions that will permanently affect your account</p>

                <div className="delete">
                    <div>
                        <h4>Delete My Account</h4>
                        <p>Once you delete your account, there is no going back. All your data will be permanently deleted.</p>
                    </div>
                    <button onClick={handleDeleteAccount}>Delete Account</button>
                </div>
            </div>
        </div>
    );
};

export default CitizenSettings;