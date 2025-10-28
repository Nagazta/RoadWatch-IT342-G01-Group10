// src/components/modals/LogoutModal.jsx
import React from 'react';
import ConfirmationModal from './ConfirmationModal';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Logout?"
      message="Are you sure you want to logout?"
      confirmText="Logout"
      type="danger"
    />
  );
};

export default LogoutModal;