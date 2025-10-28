import React, { useState } from 'react';
import AccountSettings from '../../components/settings/AccountSettings';
import SystemPreferences from '../../components/settings/SystemPreferences';
import SecuritySettings from '../../components/settings/SecuritySettings';
import SettingsActions from '../../components/settings/SettingsActions';
import '../admin/styles/SystemSettings.css';

const SystemSettings = () => {
  const [accountData, setAccountData] = useState({
    adminName: 'Kyle Sepulveda',
    email: 'kyle@roadwatch.gov.ph',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newReportSubmitted: true,
    reportStatusUpdated: true,
    userRegistered: false,
    systemAlerts: true
  });

  const [preferences, setPreferences] = useState({
    themeMode: 'Light',
    dataRetentionPeriod: '90 days'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    loginAttemptsLimit: '5 attempts',
    sessionTimeout: '30 minutes'
  });

  const handleAccountChange = (field, value) => {
    setAccountData(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = () => {
    console.log('Change password clicked');
  };

  const handleChangeAvatar = () => {
    console.log('Change avatar clicked');
  };

  const handleNotificationToggle = (setting) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityToggle = (setting) => {
    setSecuritySettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleResetToDefault = () => {
    console.log('Reset to default');
  };

  const handleSaveChanges = () => {
    console.log('Save all changes');
  };

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
          onResetToDefault={handleResetToDefault}
          onSaveChanges={handleSaveChanges}
        />
      </div>
    </div>
  );
};

export default SystemSettings;