import React from 'react';
import { DownloadIcon } from '../common/Icons';
import '../users/styles/ExportUsersButton.css';

const ExportUsersButton = ({ onClick }) => {
  return (
    <button className="export-users-btn" onClick={onClick}>
      <DownloadIcon />
      <span>Export Users</span>
    </button>
  );
};

export default ExportUsersButton;