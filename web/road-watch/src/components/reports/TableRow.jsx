import React from 'react';
import StatusBadge from '../reports/StatusBadge';
import ActionButtons from '../reports/ActionsButton';
import '../reports/styles/TableRow.css';

const TableRow = ({
  report,
  onView,
  onEdit,
  onDelete,
  onViewHistory,
  userRole = 'admin',
  viewMode = 'all'  // ✅ Add viewMode prop
}) => {
  return (
    <tr className="table-row">
      <td className="report-id">{report.id}</td>
      <td className="report-title">{report.title}</td>
      <td>{report.category}</td>
      <td>{report.submittedByName || report.submittedBy}</td>
      <td>{new Date(report.dateSubmitted).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })}</td>
      <td>
        <StatusBadge status={report.status} />
      </td>
      <td className="actions-cell">
        <ActionButtons
          reportId={report.id}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewHistory={onViewHistory}
          userRole={userRole}
          viewMode={viewMode}  // ✅ Pass viewMode
        />
      </td>
    </tr>
  );
};

export default TableRow;