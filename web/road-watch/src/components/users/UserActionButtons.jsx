import React from 'react';
import { EyeIcon, EditIcon, UserXIcon, UserCheckIcon, ShieldOffIcon } from '../common/Icons';
import '../users/styles/UserActionButton.css';

const UserActionButtons = ({ userId, status, role, onView, onEdit, onSuspend, onActivate, onRevoke }) => {
  return (
    <div className="user-action-buttons">
      <button 
        className="user-action-btn user-view-btn" 
        onClick={() => onView(userId)}
        title="View"
      >
        <EyeIcon />
        <span>View</span>
      </button>
      <button 
        className="user-action-btn user-edit-btn" 
        onClick={() => onEdit(userId)}
        title="Edit"
      >
        <EditIcon />
        <span>Edit</span>
      </button>
      {status === 'Active' && role !== 'Admin' && (
        <>
          {(role === 'Moderator' || role === 'Admin') && (
            <button 
              className="user-action-btn user-revoke-btn" 
              onClick={() => onRevoke(userId)}
              title="Revoke"
            >
              <ShieldOffIcon />
              <span>Revoke</span>
            </button>
          )}
          {role === 'Citizen' && (
            <button 
              className="user-action-btn user-suspend-btn" 
              onClick={() => onSuspend(userId)}
              title="Suspend"
            >
              <UserXIcon />
              <span>Suspend</span>
            </button>
          )}
        </>
      )}
      {status === 'Suspended' && (
        <button 
          className="user-action-btn user-activate-btn" 
          onClick={() => onActivate(userId)}
          title="Activate"
        >
          <UserCheckIcon />
          <span>Activate</span>
        </button>
      )}
    </div>
  );
};

export default UserActionButtons;