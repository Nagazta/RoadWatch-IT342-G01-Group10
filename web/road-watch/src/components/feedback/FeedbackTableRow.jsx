import React from 'react';
import FeedbackCategoryBadge from './FeedbackCategoryBadge';
import FeedbackStatusBadge from './FeedbackStatusBadge';
import { EyeIcon, EditIcon } from '../common/Icons';
import '../reports/styles/TableRow.css';
import '../feedback/styles/FeedbackTableRow.css';

const FeedbackTableRow = ({ feedback, onView, onEdit }) => {
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
        <div className="action-buttons-group">
          <button 
            className="feedback-view-btn" 
            onClick={() => onView(feedback.id)}
            title="View Details"
          >
            <EyeIcon />
          </button>
          <button 
            className="feedback-edit-btn" 
            onClick={() => onEdit(feedback.id)}
            title="Edit & Respond"
          >
            <EditIcon />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FeedbackTableRow;