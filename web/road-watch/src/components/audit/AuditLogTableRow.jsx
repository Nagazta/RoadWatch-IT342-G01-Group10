import React from 'react';
import AuditLogStatusBadge from '../audit/AuditLogStatusBadge';
import '../reports/styles/TableRow.css';
import '../audit/styles/AuditLogTableRow.css';

const AuditLogTableRow = ({ log }) => {
  return (
    <tr className="table-row">
      <td className="report-id">{log.id}</td>
      <td>
        <div className="audit-user-info">
          <span className="audit-user-name">{log.user}</span>
          <span className="audit-user-role">({log.userRole})</span>
        </div>
      </td>
      <td className="audit-action">{log.action}</td>
      <td className="audit-description">{log.description}</td>
      <td className="audit-datetime">{log.dateTime}</td>
      <td>
        <AuditLogStatusBadge status={log.status} />
      </td>
    </tr>
  );
};

export default AuditLogTableRow;