// src/components/users/RoleFilter.jsx
import React from 'react';
import '../reports/styles/FilterDropdown.css';

const RoleFilter = ({ value, onChange }) => {
  const roles = [
    'All Roles',
    'Citizen',
    'Moderator',
    'Admin'
  ];

  return (
    <div className="filter-dropdown">
      <select 
        className="filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoleFilter;