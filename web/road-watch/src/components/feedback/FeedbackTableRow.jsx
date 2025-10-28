import React from 'react';
import FeedbackCategoryBadge from './FeedbackCategoryBadge';
import FeedbackStatusBadge from './FeedbackStatusBadge';
import { EyeIcon } from '../common/Icons';
import '../reports/styles/TableRow.css';
import '../feedback/styles/FeedbackTableRow.css';

const FeedbackTableRow = ({ feedback, onView }) => {
  return (
    <tr className="table-row">
      <td className="report-id">{feedback.id}</td>
      <td>{feedback.submittedBy}</td>
      <td>
        <FeedbackCategoryBadge category={feedback.category} />
      </td>
      <td>{feedback.dateSubmitted}</td>
      <td>
        <FeedbackStatusBadge status={feedback.status} />
      </td>
      <td>
        <button 
          className="action-btn view-btn feedback-view-btn" 
          onClick={() => onView(feedback.id)}
        >
          <EyeIcon />
          <span>View</span>
        </button>
      </td>
    </tr>
  );
};

export default FeedbackTableRow;