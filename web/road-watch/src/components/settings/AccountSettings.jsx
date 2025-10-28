import React from 'react';
import { UserCircleIcon, UploadIcon } from '../common/Icons';
import '../settings/styles/AccountSettings.css';

const AccountSettings = ({ accountData, onAccountChange, onChangePassword, onChangeAvatar }) => {
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h2 className="settings-section-title">Account Settings</h2>
        <p className="settings-section-subtitle">Manage your personal account information</p>
      </div>

      <div className="account-settings-content">
        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-display">
            <UserCircleIcon />
          </div>
          <button className="change-avatar-btn" onClick={onChangeAvatar}>
            <UploadIcon />
            <span>Change</span>
          </button>
        </div>

        {/* Account Info Grid */}
        <div className="account-info-grid">
          {/* Admin Name */}
          <div className="form-group">
            <label className="form-label">Admin Name</label>
            <input
              type="text"
              className="form-input"
              value={accountData.adminName}
              onChange={(e) => onAccountChange('adminName', e.target.value)}
            />
          </div>

          {/* Current Password */}
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Kyle Sepulveda"
              value={accountData.currentPassword}
              onChange={(e) => onAccountChange('currentPassword', e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={accountData.email}
              disabled
            />
            <span className="form-hint">Email cannot be changed</span>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Kyle Sepulveda"
              value={accountData.confirmPassword}
              onChange={(e) => onAccountChange('confirmPassword', e.target.value)}
            />
          </div>

          {/* Spacer */}
          <div></div>

          {/* New Password */}
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Kyle Sepulveda"
              value={accountData.newPassword}
              onChange={(e) => onAccountChange('newPassword', e.target.value)}
            />
          </div>
        </div>

        {/* Change Password Button */}
        <div className="account-actions">
          <button className="change-password-btn" onClick={onChangePassword}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;