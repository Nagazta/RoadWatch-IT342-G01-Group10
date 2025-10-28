import React from 'react';
import '../reports/styles/TableHeader.css';

const UsersTableHeader = () => {
  return (
    <thead className="table-header">
      <tr>
        <th>User ID</th>
        <th>Full Name</th>
        <th>Role</th>
        <th>Email</th>
        <th>Date Registered</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
  );
};

export default UsersTableHeader;