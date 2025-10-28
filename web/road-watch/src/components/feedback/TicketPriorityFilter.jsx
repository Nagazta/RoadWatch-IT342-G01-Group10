import React from 'react';
import '../reports/styles/FilterDropdown.css';

const TicketPriorityFilter = ({ value, onChange }) => {
  const priorities = [
    'All Priorities',
    'High',
    'Medium',
    'Low'
  ];

  return (
    <div className="filter-dropdown">
      <select 
        className="filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {priorities.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TicketPriorityFilter;