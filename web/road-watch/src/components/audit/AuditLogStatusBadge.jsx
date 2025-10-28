import React from 'react';
import '../audit/styles/AuditLogStatusBadge.css';

const AuditLogStatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Success':
        return 'audit-status-success';
      case 'Failed':
        return 'audit-status-failed';
      case 'System':
        return 'audit-status-system';
      default:
        return '';
    }
  };

  return (
    <span className={`audit-status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default AuditLogStatusBadge;