import React from 'react';
import '../assign/styles/AssignStatusBadge.css';

const AssignStatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Unassigned':
        return 'assign-status-unassigned';
      case 'Assigned':
        return 'assign-status-assigned';
      case 'In Progress':
        return 'assign-status-in-progress';
      case 'Resolved':
        return 'assign-status-resolved';
      default:
        return '';
    }
  };

  return (
    <span className={`assign-status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default AssignStatusBadge;