// src/components/reports/ActionButtons.jsx
import React from 'react';
import { EyeIcon, EditIcon, TrashIcon } from '../common/Icons';
import '../reports/styles/ActionsButton.css';

const ActionButtons = ({ reportId, onView, onEdit, onDelete }) => {
  return (
    <div className="action-buttons">
      <button 
        className="action-btn view-btn" 
        onClick={() => onView(reportId)}
        title="View"
      >
        <EyeIcon />
        <span>View</span>
      </button>
      <button 
        className="action-btn edit-btn" 
        onClick={() => onEdit(reportId)}
        title="Edit"
      >
        <EditIcon />
        <span>Edit</span>
      </button>
      <button 
        className="action-btn delete-btn" 
        onClick={() => onDelete(reportId)}
        title="Delete"
      >
        <TrashIcon />
        <span>Delete</span>
      </button>
    </div>
  );
};

export default ActionButtons;