// src/components/assign/AssignReportTableRow.jsx
import React from 'react';
import AssignStatusBadge from './AssignStatusBadge';
import AssignActionButton from './AssignActionButton';
import '../reports/styles/TableRow.css';

const AssignReportTableRow = ({ report, onAssign, onReassign }) => {
  return (
    <tr className="table-row">
      <td className="report-id">{report.id}</td>
      <td className="report-title">{report.title}</td>
      <td>{report.category}</td>
      <td>{report.location}</td>
      <td>{report.dateSubmitted}</td>
      <td>
        <AssignStatusBadge status={report.status} />
      </td>
      <td>{report.assignedInspector || '—'}</td>
      <td>
        <AssignActionButton
          reportId={report.id}
          status={report.status}
          hasInspector={!!report.assignedInspector}
          onAssign={onAssign}
          onReassign={onReassign}
        />
      </td>
    </tr>
  );
};

export default AssignReportTableRow;