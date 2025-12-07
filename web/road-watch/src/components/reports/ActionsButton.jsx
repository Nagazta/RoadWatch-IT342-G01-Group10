import React from 'react';
import { EyeIcon, EditIcon, TrashIcon, HistoryIcon } from '../common/Icons';
import './styles/ActionsButton.css';



const ActionButtons = ({
  reportId,
  onView,
  onEdit,
  onDelete,
  onViewHistory, // ✅ New prop
  userRole = 'admin'
}) => {
  return (
    <div className="action-buttons">
      {/* View Button - All roles */}
      {onView && (
        <button
          className="action-btn view-btn"
          onClick={() => onView(reportId)}
          title="View Details"
        >
          <EyeIcon />
        </button>
      )}

      {/* Edit Button - Inspector and Admin */}
      {(userRole === 'inspector' || userRole === 'admin') && onEdit && (
        <button
          className="action-btn edit-btn"
          onClick={() => onEdit(reportId)}
          title="Edit Report"
        >
          <EditIcon />
        </button>
      )}

      {/* History Button - All roles */}
      {onViewHistory && (
        <button
          className="action-btn history-btn"
          onClick={() => onViewHistory(reportId)}
          title="View Update History"
        >
          <HistoryIcon />
        </button>
      )}

      {/* Delete Button - Admin only */}
      {userRole === 'admin' && onDelete && (
        <button
          className="action-btn delete-btn"
          onClick={() => onDelete(reportId)}
          title="Delete Report"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

export default ActionButtons;