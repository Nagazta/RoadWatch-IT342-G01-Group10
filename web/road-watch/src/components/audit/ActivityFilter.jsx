// src/components/audit/ActivityFilter.jsx
import React from 'react';
import '../reports/styles/FilterDropdown.css';

const ActivityFilter = ({ value, onChange }) => {
  const activities = [
    'All Activities',
    'Login',
    'Report Submission',
    'Report Update',
    'User Modification',
    'System Change',
    'Automated Process',
    'Notification',
    'Account Update'
  ];

  return (
    <div className="filter-dropdown">
      <select 
        className="filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {activities.map((activity) => (
          <option key={activity} value={activity}>
            {activity}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ActivityFilter;