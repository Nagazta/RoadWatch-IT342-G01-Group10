import React from 'react';
import '../assign/styles/InspectorCard.css';

const InspectorCard = ({ inspector }) => {
  const getStatusClass = (status) => {
    return status === 'Busy' ? 'status-busy' : 'status-available';
  };

  const getStatusColor = (status) => {
    return status === 'Busy' ? '#fbc02d' : '#2e7d32';
  };

  return (
    <div className="inspector-card">
      <div className="inspector-card-content">
        <h3 className="inspector-name">{inspector.name}</h3>
        <p className="inspector-assignments">Active assignments: {inspector.activeAssignments}</p>
      </div>
      <div className="inspector-status">
        <span 
          className="status-dot" 
          style={{ backgroundColor: getStatusColor(inspector.status) }}
        ></span>
        <span className={`status-text ${getStatusClass(inspector.status)}`}>
          {inspector.status}
        </span>
      </div>
    </div>
  );
};

export default InspectorCard;