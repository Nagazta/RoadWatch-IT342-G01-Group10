import React from 'react';
import SearchBar from '../reports/SearchBar';
import CategoryFilter from '../reports/CategoryFilter';
import StatusFilter from '../reports/StatusFilter';
import AssignReportsTable from './AssignReportsTable';
import '../assign/styles/AssignReportsSection.css';

const AssignReportsSection = ({
  reports,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  onAssign,
  onReassign
}) => {
  return (
    <div className="assign-reports-section">
      <div className="assign-reports-filters">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by ID, title, or location..."
        />
        <CategoryFilter
          value={selectedCategory}
          onChange={onCategoryChange}
        />
        <StatusFilter
          value={selectedStatus}
          onChange={onStatusChange}
        />
      </div>

      <AssignReportsTable
        reports={reports}
        onAssign={onAssign}
        onReassign={onReassign}
      />

      <div className="assign-reports-footer">
        <span className="reports-count">Showing 1 to 5 of 5 reports</span>
        <div className="reports-pagination">
          <span className="page-info">Page 1 of 1</span>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled>Previous</button>
            <button className="pagination-btn" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignReportsSection;