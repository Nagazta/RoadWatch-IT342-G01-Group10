import React from 'react';
import '../settings/styles/SettingsActions.css';

const SettingsActions = ({ onResetToDefault, onSaveChanges }) => {
  return (
    <div className="settings-actions">
      <button className="reset-btn" onClick={onResetToDefault}>
        Reset to Default
      </button>
      <button className="save-btn" onClick={onSaveChanges}>
        Save All Changes
      </button>
    </div>
  );
};

export default SettingsActions;