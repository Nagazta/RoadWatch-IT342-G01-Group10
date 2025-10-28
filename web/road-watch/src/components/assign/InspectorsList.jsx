import React from 'react';
import InspectorCard from './InspectorCard';
import '../assign/styles/InspectorsList.css';

const InspectorsList = ({ inspectors }) => {
  return (
    <div className="inspectors-list-container">
      <h2 className="inspectors-list-title">Inspectors</h2>
      <div className="inspectors-cards">
        {inspectors.map(inspector => (
          <InspectorCard key={inspector.id} inspector={inspector} />
        ))}
      </div>
    </div>
  );
};

export default InspectorsList;