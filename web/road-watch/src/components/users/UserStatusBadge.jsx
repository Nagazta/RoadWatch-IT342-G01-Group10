import React from 'react';
import '../users/styles/UserStatusBadge.css';

const UserStatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'user-status-active';
      case 'Suspended':
        return 'user-status-suspended';
      default:
        return '';
    }
  };

  return (
    <span className={`user-status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default UserStatusBadge;