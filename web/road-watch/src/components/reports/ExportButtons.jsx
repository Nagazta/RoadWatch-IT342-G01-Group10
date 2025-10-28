import React from 'react';
import { DownloadIcon } from '../common/Icons';
import '../reports/styles/ExportButtons.css';

const ExportButtons = ({ onExportCSV, onExportPDF }) => {
  return (
    <>
      <button className="export-btn" onClick={onExportCSV}>
        <DownloadIcon />
        <span>CSV</span>
      </button>
      <button className="export-btn" onClick={onExportPDF}>
        <DownloadIcon />
        <span>PDF</span>
      </button>
    </>
  );
};

export default ExportButtons;