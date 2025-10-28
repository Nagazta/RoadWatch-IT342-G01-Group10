import React from 'react';
import SearchBar from '../reports/SearchBar';
import ActivityFilter from './ActivityFilter';
import DateRangeButton from '../reports/DateRangeButton';
import ExportButtons from '../reports/ExportButtons';
import '../audit/styles/AuditLogsFilters.css';

const AuditLogsFilters = ({
  searchQuery,
  onSearchChange,
  selectedActivity,
  onActivityChange,
  onDateRange,
  onExportCSV,
  onExportPDF
}) => {
  return (
    <div className="audit-logs-filters-section">
      <div className="audit-logs-filters-left">
        <SearchBar 
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by user, action, or report ID..."
        />
        <ActivityFilter 
          value={selectedActivity}
          onChange={onActivityChange}
        />
        <DateRangeButton onClick={onDateRange} />
      </div>

      <div className="audit-logs-filters-right">
        <ExportButtons 
          onExportCSV={onExportCSV}
          onExportPDF={onExportPDF}
        />
      </div>
    </div>
  );
};

export default AuditLogsFilters;