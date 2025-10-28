import React from 'react';
import '../reports/styles/TableHeader.css';

const AuditLogsTableHeader = () => {
  return (
    <thead className="table-header">
      <tr>
        <th>Log ID</th>
        <th>User</th>
        <th>Action</th>
        <th>Description</th>
        <th>Date & Time</th>
        <th>Status</th>
      </tr>
    </thead>
  );
};

export default AuditLogsTableHeader;