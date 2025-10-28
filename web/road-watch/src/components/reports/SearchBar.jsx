import React from 'react';
import { SearchIcon } from '../common/Icons';
import '../reports/styles/SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = "Search by keyword or report ID..." }) => {
  return (
    <div className="search-container">
      <div className="search-icon-wrapper">
        <SearchIcon />
      </div>
      <input
        type="text"
        className="search-input-field"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;