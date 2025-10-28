import React from 'react';
import '../feedback/styles/TicketStatusBadge.css';

const TicketStatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Open':
        return 'ticket-status-open';
      case 'In Progress':
        return 'ticket-status-in-progress';
      case 'Resolved':
        return 'ticket-status-resolved';
      case 'Closed':
        return 'ticket-status-closed';
      default:
        return '';
    }
  };

  return (
    <span className={`ticket-status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default TicketStatusBadge;