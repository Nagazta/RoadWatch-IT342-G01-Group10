import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AccountSettings from '../../components/settings/AccountSettings';
import SystemPreferences from '../../components/settings/SystemPreferences';
import SecuritySettings from '../../components/settings/SecuritySettings';
import SettingsActions from '../../components/settings/SettingsActions';
import authService from '../../services/api/authService';
import '../admin/styles/SystemSettings.css';

const baseURL = `${import.meta.env.VITE_API_URL}/api`;

const SystemSettings = () => {
  // Account Settings State
  const [accountData, setAccountData] = useState({
    username: '',
    adminName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    newReportSubmitted: true,
    reportStatusUpdated: true,
    userRegistered: true,
    systemAlerts: true
  });

  // System Preferences State
  const [preferences, setPreferences] = useState({
    themeMode: 'Light',
    dataRetentionPeriod: '90 days'
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAttemptsLimit: '5 attempts',
    sessionTimeout: '30 minutes'
  });

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch profile on mount
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // Get current user data from localStorage
        const currentUser = authService.getCurrentUser();
        const roleData = authService.getRoleData();

        if (!currentUser) {
          console.error('No user data found');
          setLoading(false);
          return;
        }

        const currentUserId = currentUser.id;
        setUserId(currentUserId);

        // Fetch user profile from backend
        const token = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/users/profile`, {
          params: { userId: currentUserId },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data) {
          setAccountData({
            username: response.data.username || '',
            adminName: response.data.name || '',
            email: response.data.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAccountChange = (field, value) => {
    setAccountData(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = accountData;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      const result = await authService.changePassword(userId, currentPassword, newPassword);

      if (result.success) {
        alert('Password changed successfully!');
        // Clear password fields
        setAccountData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        alert(result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  const handleChangeAvatar = () => {
    // TODO: Implement avatar change functionality
    alert('Avatar change functionality coming soon!');
  };

  const handleNotificationToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityToggle = (setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const { username, adminName, email } = accountData;
      const payload = {
        username,
        name: adminName,
        email
      };

      const token = localStorage.getItem('token');
      const response = await axios.put(`${baseURL}/users/profile`, payload, {
        params: { userId: userId },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        alert('Profile updated successfully!');

        // Update localStorage user data
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          currentUser.username = username;
          currentUser.name = adminName;
          currentUser.email = email;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleResetSettings = () => {
    const confirmed = window.confirm('Are you sure you want to reset all settings to defaults?');
    if (confirmed) {
      // Reset to default values
      setNotificationSettings({
        newReportSubmitted: true,
        reportStatusUpdated: true,
        userRegistered: true,
        systemAlerts: true
      });
      setPreferences({
        themeMode: 'Light',
        dataRetentionPeriod: '90 days'
      });
      setSecuritySettings({
        twoFactorAuth: false,
        loginAttemptsLimit: '5 attempts',
        sessionTimeout: '30 minutes'
      });
      alert('Settings reset to defaults');
    }
  };

  if (loading) {
    return (
      <div className="system-settings-container">
        <div className="settings-content">
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="system-settings-container">
      <div className="settings-content">
        <AccountSettings
          accountData={accountData}
          onAccountChange={handleAccountChange}
          onChangePassword={handleChangePassword}
          onChangeAvatar={handleChangeAvatar}
        />

        <SystemPreferences
          notificationSettings={notificationSettings}
          preferences={preferences}
          onNotificationToggle={handleNotificationToggle}
          onPreferenceChange={handlePreferenceChange}
        />

        <SecuritySettings
          securitySettings={securitySettings}
          onSecurityToggle={handleSecurityToggle}
          onSecurityChange={handleSecurityChange}
        />

        <SettingsActions
          onSaveChanges={handleSaveChanges}
          onResetToDefault={handleResetSettings}
        />
      </div>
    </div>
  );
};

export default SystemSettings;
