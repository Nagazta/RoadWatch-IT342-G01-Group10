import React, { useState, useEffect } from 'react';
import { XIcon } from '../common/Icons';
import ToggleSwitch from '../settings/ToggleSwitch';
import '../modal/styles/UserDetailsModal.css';

const UserDetailsModal = ({ user, isOpen, onClose, onSave, mode = 'view' }) => {
  const [formData, setFormData] = useState({
    role: 'CITIZEN',
    isActive: true
  });

  useEffect(() => {
    if (user) {
      console.log('🔄 UserDetailsModal - Loading user:', user);
      setFormData({
        role: user.role || 'CITIZEN',
        isActive: user.status === 'Active'
      });
    }
  }, [user, mode]);

  if (!isOpen || !user) return null;

  const isEditing = mode === 'edit';

  const handleRoleChange = (e) => {
    console.log('🔄 Role changed to:', e.target.value);
    setFormData(prev => ({ ...prev, role: e.target.value }));
  };

  const handleStatusToggle = () => {
    setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleSuspend = () => {
    console.log('Suspend user:', user.id);
    onClose();
  };

  const handleSaveChanges = () => {
    console.log('💾 Saving user changes');
    console.log('Original user:', user);
    console.log('Form data:', formData);
    
    // ✅ Create clean payload - don't spread original user
    const updatedUser = {
      id: user.id,
      email: user.email,
      name: user.fullName,
      role: formData.role,  // Already uppercase from dropdown
      isActive: formData.isActive
    };
    
    console.log('📤 Sending to backend:', updatedUser);
    onSave(updatedUser);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">User Details - {user.id}</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <XIcon />
          </button>
        </div>

        <div className="modal-body">
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

          <div className="modal-field">
            <label className="modal-label">Full Name</label>
            <div className="modal-value-box">{user.fullName}</div>
          </div>

          <div className="modal-field">
            <label className="modal-label">Email</label>
            <div className="modal-value-box">{user.email}</div>
          </div>

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

          {isEditing && <div className="modal-divider"></div>}

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
                  <option value="CITIZEN">Citizen</option>
                  <option value="INSPECTOR">Inspector</option>
                  <option value="ADMIN">Admin</option>
                </select>
              ) : (
                <div className="modal-value-box">{user.role}</div>
              )}
            </div>
            <div className="modal-field">
              <label className="modal-label">Status</label>
              <div className="modal-status-toggle">
                <ToggleSwitch
                  checked={formData.isActive}
                  onChange={handleStatusToggle}
                  disabled={!isEditing}
                />
                <span className={`modal-status-text ${formData.isActive ? 'active' : 'inactive'}`}>
                  {formData.isActive ? 'Active' : 'Suspended'}
                </span>
              </div>
            </div>
          </div>
        </div>

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