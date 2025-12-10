import React from 'react';
import FeedbackTableHeader from './FeedbackTableHeader';
import FeedbackTableRow from './FeedbackTableRow';
import '../reports/styles/ReportsTable.css';

const FeedbackTable = ({ feedbackData, onView, onEdit }) => { // <- ADDED onEdit
  return (
    <div className="table-container">
      <table className="reports-table">
        <FeedbackTableHeader />
        <tbody>
          {feedbackData.map((feedback, index) => (
            <FeedbackTableRow
              key={`${feedback.id}-${index}`}
              feedback={feedback}
              onView={onView}
              onEdit={onEdit} // <- ADDED
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;