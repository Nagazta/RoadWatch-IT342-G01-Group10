// src/components/modal/UserDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { XIcon } from '../common/Icons';
import ToggleSwitch from '../settings/ToggleSwitch';
import '../modal/styles/UserDetailsModal.css';

const UserDetailsModal = ({ user, isOpen, onClose, onSave, mode = 'view' }) => {
  const [formData, setFormData] = useState({
    role: user?.role || 'Citizen',
    status: user?.status === 'Active'
  });

  // Update formData when user or mode changes
  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role,
        status: user.status === 'Active'
      });
    }
  }, [user, mode]);

  if (!isOpen || !user) return null;

  const isEditing = mode === 'edit'; // Use the mode prop directly

  const handleRoleChange = (e) => {
    setFormData(prev => ({ ...prev, role: e.target.value }));
  };

  const handleStatusToggle = () => {
    setFormData(prev => ({ ...prev, status: !prev.status }));
  };

  const handleSuspend = () => {
    console.log('Suspend user:', user.id);
    onClose();
  };

  const handleSaveChanges = () => {
    onSave({ 
      ...user, 
      role: formData.role, 
      status: formData.status ? 'Active' : 'Suspended' 
    });
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">User Details - {user.id}</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <XIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* User ID and Date Registered */}
          <div className="modal-grid-2">
            <div className="modal-field">
              <label className="modal-label">User ID</label>
              <div className="modal-value-box">{user.id}</div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Date Registered</label>
              <div className="modal-value-box">{user.dateRegistered}</div>
            </div>
          </div>

          {/* Full Name */}
          <div className="modal-field">
            <label className="modal-label">Full Name</label>
            <div className="modal-value-box">{user.fullName}</div>
          </div>

          {/* Email */}
          <div className="modal-field">
            <label className="modal-label">Email</label>
            <div className="modal-value-box">{user.email}</div>
          </div>

          {/* Reports Submitted and Last Login */}
          <div className="modal-grid-2">
            <div className="modal-field">
              <label className="modal-label">Reports Submitted</label>
              <div className="modal-value-box">5</div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Last Login</label>
              <div className="modal-value-box">October 21, 2025, 02:15 PM</div>
            </div>
          </div>

          {/* Divider - only show in edit mode */}
          {isEditing && <div className="modal-divider"></div>}

          {/* Role and Status */}
          <div className="modal-grid-2">
            <div className="modal-field">
              <label className="modal-label">
                Role {isEditing && <span className="required-asterisk">*</span>}
              </label>
              {isEditing ? (
                <select 
                  className="modal-select"
                  value={formData.role}
                  onChange={handleRoleChange}
                >
                  <option value="Citizen">Citizen</option>
                  <option value="Inspector">Inspector</option>
                  <option value="Admin">Admin</option>
                </select>
              ) : (
                <div className="modal-value-box">{user.role}</div>
              )}
            </div>
            <div className="modal-field">
              <label className="modal-label">Status</label>
              <div className="modal-status-toggle">
                <ToggleSwitch
                  checked={formData.status}
                  onChange={handleStatusToggle}
                  disabled={!isEditing}
                />
                <span className={`modal-status-text ${formData.status ? 'active' : 'inactive'}`}>
                  {formData.status ? 'Active' : 'Suspended'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          {isEditing ? (
            <>
              {user.role === 'Citizen' && (
                <button className="modal-btn suspend-btn" onClick={handleSuspend}>
                  Suspend User
                </button>
              )}
              <div className="modal-actions-right">
                <button className="modal-btn close-btn" onClick={handleClose}>
                  Close
                </button>
                <button className="modal-btn save-btn" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <div className="modal-actions-center">
              <button className="modal-btn close-btn" onClick={handleClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;