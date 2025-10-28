// src/components/feedback/SupportTicketsTableHeader.jsx
import React from 'react';
import '../reports/styles/TableHeader.css';

const SupportTicketsTableHeader = () => {
  return (
    <thead className="table-header">
      <tr>
        <th>Ticket ID</th>
        <th>Issue Type</th>
        <th>Priority</th>
        <th>Status</th>
        <th>Assigned To</th>
        <th>Date Created</th>
      </tr>
    </thead>
  );
};

export default SupportTicketsTableHeader;