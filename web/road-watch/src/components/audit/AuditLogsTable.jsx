import React from 'react';
import AuditLogsTableHeader from '../audit/AuditLogsTableHeader';
import AuditLogTableRow from '../audit/AuditLogTableRow';
import '../reports/styles/ReportsTable.css';

const AuditLogsTable = ({ logs }) => {
  return (
    <div className="table-container">
      <table className="reports-table">
        <AuditLogsTableHeader />
        <tbody>
          {logs.map((log, index) => (
            <AuditLogTableRow
              key={`${log.id}-${index}`}
              log={log}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogsTable;