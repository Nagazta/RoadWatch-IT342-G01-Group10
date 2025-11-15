import React from 'react';
import '../reports/styles/ReportsPagination.css';

const ReportsPagination = ({ 
  rowsPerPage, 
  onRowsPerPageChange, 
  currentPage, 
  totalPages,
  onPageChange
}) => {

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-section">
      <div className="rows-per-page">
        <span>Rows per page:</span>
        <select 
          className="rows-select"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>

      <div className="pagination-info">
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      <div className="pagination-controls">
        <button className="pagination-btn" onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </button>
        <button className="pagination-btn" onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ReportsPagination;
