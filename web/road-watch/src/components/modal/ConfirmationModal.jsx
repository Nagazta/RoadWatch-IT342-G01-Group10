// Update src/components/modals/ConfirmationModal.jsx
import React from 'react';
import { XIcon, AlertIcon, LogoutIconAlt, TrashIcon } from '../common/Icons';
import '../modal/styles/ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  cancelText = 'Cancel',
  type = 'warning' // 'warning', 'danger', or 'delete'
}) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case 'danger':
      case 'delete':
        return '#d32f2f';
      case 'warning':
        return '#f57f17';
      default:
        return '#f57f17';
    }
  };

  const getIcon = () => {
    if (title === 'Logout?') {
      return <LogoutIconAlt />;
    }
    if (type === 'delete' || title.includes('Delete')) {
      return <TrashIcon />;
    }
    return <AlertIcon />;
  };

  return (
    <div className="confirmation-overlay" onClick={onClose}>
      <div className="confirmation-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="confirmation-close-btn" onClick={onClose}>
          <XIcon />
        </button>

        {/* Icon and Content */}
        <div className="confirmation-body">
          <div className="confirmation-icon" style={{ color: getIconColor() }}>
            {getIcon()}
          </div>
          <h2 className="confirmation-title">{title}</h2>
          <p className="confirmation-message">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <button className="confirmation-btn cancel-btn" onClick={onClose}>
            {cancelText}
          </button>
          <button 
            className={`confirmation-btn confirm-btn ${type === 'delete' ? 'delete-btn' : ''}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;