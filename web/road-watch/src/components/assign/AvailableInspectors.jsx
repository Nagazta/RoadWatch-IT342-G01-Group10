import React from 'react';
import AvailableInspectorCard from './AvailableInspectorCard';
import '../assign/styles/AvailableInspectors.css';

const AvailableInspectors = ({ availableInspectors }) => {
  return (
    <div className="available-inspectors-container">
      <div className="available-inspectors-header">
        <h2 className="available-inspectors-title">Available Inspectors</h2>
        <span className="ready-badge">{availableInspectors.length} Ready</span>
      </div>
      <div className="available-inspectors-grid">
        {availableInspectors.map(inspector => (
          <AvailableInspectorCard key={inspector.id} inspector={inspector} />
        ))}
      </div>
    </div>
  );
};

export default AvailableInspectors;