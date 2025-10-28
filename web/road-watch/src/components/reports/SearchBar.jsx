import React from 'react';
import { SearchIcon } from '../common/Icons';
import '../reports/styles/SearchBar.css';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-container">
      <div className="search-icon-wrapper">
        <SearchIcon />
      </div>
      <input
        type="text"
        className="search-input-field"
        placeholder="Search by keyword or report ID..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;