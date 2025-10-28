import React from 'react';
import { CheckCircleIcon } from '../common/Icons';
import '../assign/styles/AvailableInspectorsCard.css';

const AvailableInspectorCard = ({ inspector }) => {
  return (
    <div className="available-inspector-card">
      <div className="available-inspector-icon">
        <CheckCircleIcon />
      </div>
      <div className="available-inspector-info">
        <h3 className="available-inspector-name">{inspector.name}</h3>
        <p className="available-inspector-status">No active assignments</p>
      </div>
      <span className="available-badge">Available</span>
    </div>
  );
};

export default AvailableInspectorCard;