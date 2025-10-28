// src/components/feedback/TicketPriorityBadge.jsx
import React from 'react';
import '../feedback/styles/TicketPriorityBadge.css';

const TicketPriorityBadge = ({ priority }) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'ticket-priority-high';
      case 'Medium':
        return 'ticket-priority-medium';
      case 'Low':
        return 'ticket-priority-low';
      default:
        return '';
    }
  };

  return (
    <span className={`ticket-priority-badge ${getPriorityClass(priority)}`}>
      {priority}
    </span>
  );
};

export default TicketPriorityBadge;