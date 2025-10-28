import React from 'react';
import '../reports/styles/ReportsPagination.css';

const ReportsPagination = ({ 
  rowsPerPage, 
  onRowsPerPageChange, 
  currentPage, 
  totalPages 
}) => {
  return (
    <div className="pagination-section">
      <div className="rows-per-page">
        <span>Rows per page:</span>
        <select 
          className="rows-select"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="pagination-info">
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      <div className="pagination-controls">
        <button className="pagination-btn" disabled={currentPage === 1}>
          Previous
        </button>
        <button className="pagination-btn" disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ReportsPagination;