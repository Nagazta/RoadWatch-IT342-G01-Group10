import React from 'react';
import '../reports/styles/FilterDropdown.css';

const FeedbackCategoryFilter = ({ value, onChange }) => {
  const categories = [
    'All Categories',
    'Bug',
    'Suggestion',
    'Inquiry',
    'Complaint',
    'Other'
  ];

  return (
    <div className="filter-dropdown">
      <select 
        className="filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FeedbackCategoryFilter;