import React from 'react';
import ToggleSwitch from './ToggleSwitch';
import '../settings/styles/SystemPreferences.css';

const SystemPreferences = ({ notificationSettings, preferences, onNotificationToggle, onPreferenceChange }) => {
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h2 className="settings-section-title">System Preferences</h2>
        <p className="settings-section-subtitle">Configure notifications and system behavior</p>
      </div>

      <div className="preferences-content">
        {/* Notification Settings */}
        <div className="preferences-subsection">
          <h3 className="preferences-subsection-title">Notification Settings</h3>

          <div className="notification-item">
            <div className="notification-info">
              <span className="notification-label">New Report Submitted</span>
              <span className="notification-desc">Get notified when a citizen submits a new report</span>
            </div>
            <ToggleSwitch
              checked={notificationSettings.newReportSubmitted}
              onChange={() => onNotificationToggle('newReportSubmitted')}
            />
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <span className="notification-label">Report Status Updated</span>
              <span className="notification-desc">Get notified when a report status changes</span>
            </div>
            <ToggleSwitch
              checked={notificationSettings.reportStatusUpdated}
              onChange={() => onNotificationToggle('reportStatusUpdated')}
            />
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <span className="notification-label">User Registered</span>
              <span className="notification-desc">Get notified when a new user registers</span>
            </div>
            <ToggleSwitch
              checked={notificationSettings.userRegistered}
              onChange={() => onNotificationToggle('userRegistered')}
            />
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <span className="notification-label">System Alerts</span>
              <span className="notification-desc">Get notified about critical system events</span>
            </div>
            <ToggleSwitch
              checked={notificationSettings.systemAlerts}
              onChange={() => onNotificationToggle('systemAlerts')}
            />
          </div>
        </div>

        {/* General Preferences */}
        <div className="preferences-grid">
          <div className="form-group">
            <label className="form-label">Theme Mode</label>
            <select
              className="form-select"
              value={preferences.themeMode}
              onChange={(e) => onPreferenceChange('themeMode', e.target.value)}
            >
              <option>Light</option>
              <option>Dark</option>
              <option>Auto</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Data Retention Period</label>
            <select
              className="form-select"
              value={preferences.dataRetentionPeriod}
              onChange={(e) => onPreferenceChange('dataRetentionPeriod', e.target.value)}
            >
              <option>30 days</option>
              <option>60 days</option>
              <option>90 days</option>
              <option>180 days</option>
              <option>1 year</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPreferences;