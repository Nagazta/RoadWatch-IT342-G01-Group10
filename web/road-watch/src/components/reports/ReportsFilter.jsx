import React from 'react';
import SearchBar from '../reports/SearchBar';
import CategoryFilter from '../reports/CategoryFilter';
import StatusFilter from '../reports/StatusFilter';
import DateRangeButton from '../reports/DateRangeButton';
import ExportButtons from '../reports/ExportButtons';
import '../reports/styles/ReportsFilter.css';

const ReportsFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  onDateRange,
  onExportCSV,
  onExportPDF,
  userRole // <-- add this prop
}) => {
  return (
    <div className="filters-section">
      <div className="filters-left">
        <SearchBar 
          value={searchQuery}
          onChange={onSearchChange}
        />
        <CategoryFilter 
          value={selectedCategory}
          onChange={onCategoryChange}
        />
        <StatusFilter 
          value={selectedStatus}
          onChange={onStatusChange}
        />
        <DateRangeButton onClick={onDateRange} />
      </div>

      {/* Only show ExportButtons if user is an admin */}
      {userRole === 'admin' && (
        <div className="filters-right">
          <ExportButtons 
            onExportCSV={onExportCSV}
            onExportPDF={onExportPDF}
          />
        </div>
      )}
    </div>
  );
};

export default ReportsFilters;
