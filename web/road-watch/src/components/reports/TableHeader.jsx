import React from 'react';
import '../reports/styles/TableHeader.css';

const TableHeader = () => {
  return (
    <thead className="table-header">
      <tr>
        <th>Report ID</th>
        <th>Title</th>
        <th>Category</th>
        <th>Submitted By</th>
        <th>Date Submitted</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
  );
};

export default TableHeader;