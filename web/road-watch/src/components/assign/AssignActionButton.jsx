import React from 'react';
import { UserPlusIcon, RefreshIcon } from '../common/Icons';
import '../assign/styles/AssignActionButton.css';

const AssignActionButton = ({ reportId, status, hasInspector, onAssign, onReassign }) => {
  if (status === 'Resolved') {
    return null;
  }

  if (!hasInspector || status === 'Unassigned') {
    return (
      <button 
        className="assign-action-btn assign-btn"
        onClick={() => onAssign(reportId)}
      >
        <UserPlusIcon />
        <span>Assign</span>
      </button>
    );
  }

  return (
    <button 
      className="assign-action-btn reassign-btn"
      onClick={() => onReassign(reportId)}
    >
      <RefreshIcon />
      <span>Reassign</span>
    </button>
  );
};

export default AssignActionButton;