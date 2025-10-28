import React from 'react';
import '../reports/styles/FilterDropdown.css';

const FeedbackStatusFilter = ({ value, onChange }) => {
  const statuses = [
    'All Status',
    'Pending',
    'In Progress',
    'Resolved'
  ];

  return (
    <div className="filter-dropdown">
      <select 
        className="filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FeedbackStatusFilter;