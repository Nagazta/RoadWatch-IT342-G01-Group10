import React from 'react';
import ToggleSwitch from './ToggleSwitch';
import '../settings/styles/SecuritySettings.css';

const SecuritySettings = ({ securitySettings, onSecurityToggle, onSecurityChange }) => {
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h2 className="settings-section-title">Security Settings</h2>
        <p className="settings-section-subtitle">Manage security and authentication preferences</p>
      </div>

      <div className="security-content">
        {/* Two-Factor Authentication */}
        <div className="notification-item">
          <div className="notification-info">
            <span className="notification-label">Two-Factor Authentication</span>
            <span className="notification-desc">Add an extra layer of security to your account</span>
          </div>
          <ToggleSwitch
            checked={securitySettings.twoFactorAuth}
            onChange={() => onSecurityToggle('twoFactorAuth')}
          />
        </div>

        {/* Security Options Grid */}
        <div className="preferences-grid">
          <div className="form-group">
            <label className="form-label">Login Attempts Limit</label>
            <select
              className="form-select"
              value={securitySettings.loginAttemptsLimit}
              onChange={(e) => onSecurityChange('loginAttemptsLimit', e.target.value)}
            >
              <option>3 attempts</option>
              <option>5 attempts</option>
              <option>10 attempts</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Session Timeout Duration</label>
            <select
              className="form-select"
              value={securitySettings.sessionTimeout}
              onChange={(e) => onSecurityChange('sessionTimeout', e.target.value)}
            >
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;