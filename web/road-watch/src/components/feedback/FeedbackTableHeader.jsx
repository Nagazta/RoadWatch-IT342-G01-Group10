import React from 'react';
import '../reports/styles/TableHeader.css';

const FeedbackTableHeader = () => {
  return (
    <thead className="table-header">
      <tr>
        <th>ID</th>
        <th>Submitted By</th>
        <th>Category</th>
        <th>Date Submitted</th>
        <th>Status</th>
        <th>Actions</th> {/* Changed from "Action" to "Actions" */}
      </tr>
    </thead>
  );
};

export default FeedbackTableHeader;