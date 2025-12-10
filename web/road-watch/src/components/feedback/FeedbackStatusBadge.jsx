import React from 'react';
import './styles/FeedbackStatusBadge.css';

const FeedbackStatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'feedback-status-pending';
      case 'In Progress':
        return 'feedback-status-in-progress';
      case 'Resolved':
        return 'feedback-status-resolved';
      default:
        return '';
    }
  };

  return (
    <span className={`feedback-status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default FeedbackStatusBadge;