import React from 'react';
import '../reports/styles/StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'In-Progress':
        return 'status-in-progress';
      case 'Resolved':
        return 'status-resolved';
      default:
        return '';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;