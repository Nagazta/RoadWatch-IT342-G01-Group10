import React from 'react';
import '../settings/styles/ToggleSwitch.css';

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="toggle-input"
      />
      <span className="toggle-slider"></span>
    </label>
  );
};

export default ToggleSwitch;