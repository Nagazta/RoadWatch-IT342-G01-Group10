import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AccountSettings from '../../components/settings/AccountSettings';
import SystemPreferences from '../../components/settings/SystemPreferences';
import SecuritySettings from '../../components/settings/SecuritySettings';
import SettingsActions from '../../components/settings/SettingsActions';
import '../admin/styles/SystemSettings.css';

const SystemSettings = () => {
  const [accountData, setAccountData] = useState({
    username: '',
    adminName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Fetch profile on mount
    const fetchProfile = async () => {
      try {
        const response = await axios.get('${import.meta.env.VITE_API_BASE_URL}/api/users/profile', {
          params: { userId: 1 } // Replace with authenticated user's ID
        });
        setAccountData({
          username: response.data.username,
          adminName: response.data.name,
          email: response.data.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleAccountChange = (field, value) => {
    setAccountData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const { username, adminName, email } = accountData;
      const payload = {
        username,
        name: adminName,
        email
      };
      const response = await axios.put('${import.meta.env.VITE_API_BASE_URL}/api/users/profile', payload, {
        params: { userId: 1 } // Replace with authenticated user's ID
      });
      console.log('Profile updated:', response.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="system-settings-container">
      <div className="settings-content">
        <AccountSettings
          accountData={accountData}
          onAccountChange={handleAccountChange}
          onSaveChanges={handleSaveChanges}
        />
        {/* Keep other sections as before */}
      </div>
    </div>
  );
};

export default SystemSettings;
