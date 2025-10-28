import React from 'react';
import UserStatusBadge from './UserStatusBadge';
import UserActionButtons from './UserActionButtons';
import '../reports/styles/TableRow.css';

const UserTableRow = ({ user, onView, onEdit, onSuspend, onActivate, onRevoke }) => {
  return (
    <tr className="table-row">
      <td className="report-id">{user.id}</td>
      <td className="report-title">{user.fullName}</td>
      <td>{user.role}</td>
      <td>{user.email}</td>
      <td>{user.dateRegistered}</td>
      <td>
        <UserStatusBadge status={user.status} />
      </td>
      <td className="actions-cell">
        <UserActionButtons
          userId={user.id}
          status={user.status}
          role={user.role}
          onView={onView}
          onEdit={onEdit}
          onSuspend={onSuspend}
          onActivate={onActivate}
          onRevoke={onRevoke}
        />
      </td>
    </tr>
  );
};

export default UserTableRow;