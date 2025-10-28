import React from 'react';
import '../reports/styles/TableHeader.css';

const AssignReportsTableHeader = () => {
  return (
    <thead className="table-header">
      <tr>
        <th>Report ID</th>
        <th>Title</th>
        <th>Category</th>
        <th>Location</th>
        <th>Date Submitted</th>
        <th>Status</th>
        <th>Assigned Inspector</th>
        <th>Actions</th>
      </tr>
    </thead>
  );
};

export default AssignReportsTableHeader;