import React from 'react';
import '../reports/styles/FilterDropdown.css';

const TicketDateFilter = ({ value, onChange }) => {
  const dates = [
    'Date Created',
    'Last 7 days',
    'Last 30 days',
    'Last 90 days',
    'This year'
  ];

  return (
    <div className="filter-dropdown">
      <select 
        className="filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {dates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TicketDateFilter;