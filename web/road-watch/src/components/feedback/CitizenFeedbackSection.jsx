import React from 'react';
import SearchBar from '../reports/SearchBar';
import FeedbackStatusFilter from './FeedbackStatusFilter';
import FeedbackCategoryFilter from './FeedbackCategoryFilter';
import DateRangeButton from '../reports/DateRangeButton';
import FeedbackTable from './FeedbackTable';
import ReportsPagination from '../reports/ReportsPagination';
import '../feedback/styles/CitizenFeedbackSection.css';

const CitizenFeedbackSection = ({
  feedbackData,
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  onDateRange,
  onView,
  onEdit, // <- ADDED
  rowsPerPage,
  onRowsPerPageChange
}) => {
  return (
    <div className="citizen-feedback-section">
      <h2 className="section-title">Citizen Feedback</h2>

      <div className="feedback-filters">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by ID, name, or content..."
        />
        <FeedbackStatusFilter
          value={selectedStatus}
          onChange={onStatusChange}
        />
        <FeedbackCategoryFilter
          value={selectedCategory}
          onChange={onCategoryChange}
        />
        <DateRangeButton onClick={onDateRange} />
      </div>

      <FeedbackTable
        feedbackData={feedbackData}
        onView={onView}
        onEdit={onEdit} // <- ADDED
      />

      <ReportsPagination
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        currentPage={1}
        totalPages={1}
      />
    </div>
  );
};

export default CitizenFeedbackSection;