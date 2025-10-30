import React, { useState, useEffect } from 'react';
import { XIcon } from '../common/Icons';
import '../modal/styles/AddUserModal.css';

const AddUserModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    email: '',
    contactNumber: '',
    assignedArea: '',
    address: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showRoleError, setShowRoleError] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        role: '',
        fullName: '',
        email: '',
        contactNumber: '',
        assignedArea: '',
        address: '',
        password: ''
      });
      setErrors({});
      setShowRoleError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      role: newRole,
      // Clear role-specific fields when role changes
      assignedArea: '',
      address: ''
    }));
    setShowRoleError(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.role) {
      setShowRoleError(true);
      return false;
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }

    if (formData.role === 'Inspector' && !formData.assignedArea) {
      newErrors.assignedArea = 'Assigned area is required';
    }

    if (formData.role === 'Citizen' && !formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content add-user-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add User</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <XIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body add-user-modal-body">
          <p className="add-user-subtitle">
            Select a role and fill in the details to add a new user to the system
          </p>

          {/* Role Selection */}
          <div className="modal-field">
            <label className="modal-label">
              Role <span className="required-asterisk">*</span>
            </label>
            <select 
              className={`modal-select ${!formData.role ? 'placeholder-select' : ''}`}
              value={formData.role}
              onChange={handleRoleChange}
            >
              <option value="">Choose a role</option>
              <option value="Citizen">Citizen</option>
              <option value="Inspector">Inspector</option>
              <option value="Moderator">Moderator</option>
            </select>
            {showRoleError && !formData.role && (
              <span className="field-error">Role is required</span>
            )}
          </div>

          {/* Show fields only after role is selected */}
          {formData.role && (
            <>
              {/* Full Name */}
              <div className="modal-field">
                <label className="modal-label">
                  Full Name <span className="required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  className={`modal-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                {errors.fullName && (
                  <span className="field-error">{errors.fullName}</span>
                )}
              </div>

              {/* Email Address */}
              <div className="modal-field">
                <label className="modal-label">
                  Email Address <span className="required-asterisk">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`modal-input ${errors.email ? 'error' : ''}`}
                  placeholder={
                    formData.role === 'Inspector' 
                      ? 'inspector@example.com' 
                      : formData.role === 'Citizen'
                      ? 'maria.santos@email.com'
                      : 'user@example.com'
                  }
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>

              {/* Contact Number */}
              <div className="modal-field">
                <label className="modal-label">
                  Contact Number <span className="required-asterisk">*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  className={`modal-input ${errors.contactNumber ? 'error' : ''}`}
                  placeholder="09123456789"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
                {errors.contactNumber && (
                  <span className="field-error">{errors.contactNumber}</span>
                )}
              </div>

              {/* Inspector-specific: Assigned Area */}
              {formData.role === 'Inspector' && (
                <div className="modal-field">
                  <label className="modal-label">
                    Assigned Area <span className="required-asterisk">*</span>
                  </label>
                  <select 
                    name="assignedArea"
                    className={`modal-select ${errors.assignedArea ? 'error' : ''}`}
                    value={formData.assignedArea}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a district</option>
                    <option value="Cebu City North">Cebu City North</option>
                    <option value="Cebu City South">Cebu City South</option>
                    <option value="Mandaue City">Mandaue City</option>
                    <option value="Lapu-Lapu City">Lapu-Lapu City</option>
                    <option value="Talisay City">Talisay City</option>
                  </select>
                  {errors.assignedArea && (
                    <span className="field-error">{errors.assignedArea}</span>
                  )}
                </div>
              )}

              {/* Citizen-specific: Address */}
              {formData.role === 'Citizen' && (
                <div className="modal-field">
                  <label className="modal-label">
                    Address <span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    className={`modal-input ${errors.address ? 'error' : ''}`}
                    placeholder="Brgy. Mabolo, Cebu City"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  {errors.address && (
                    <span className="field-error">{errors.address}</span>
                  )}
                </div>
              )}

              {/* Password */}
              <div className="modal-field">
                <label className="modal-label">
                  Password <span className="required-asterisk">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  className={`modal-input ${errors.password ? 'error' : ''}`}
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <span className="field-error">{errors.password}</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="modal-actions-right" style={{ marginLeft: 'auto' }}>
            <button className="modal-btn close-btn" onClick={handleClose}>
              Cancel
            </button>
            <button 
              className="modal-btn save-btn" 
              onClick={handleSubmit}
            >
              Add User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;