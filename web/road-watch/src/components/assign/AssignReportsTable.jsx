import React from 'react';
import AssignReportsTableHeader from './AssignReportsTableHeader';
import AssignReportTableRow from './AssignReportTableRow';
import '../reports/styles/ReportsTable.css';

const AssignReportsTable = ({ reports, onAssign, onReassign }) => {
  return (
    <div className="table-container">
      <table className="reports-table">
        <AssignReportsTableHeader />
        <tbody>
          {reports.map((report, index) => (
            <AssignReportTableRow
              key={`${report.id}-${index}`}
              report={report}
              onAssign={onAssign}
              onReassign={onReassign}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignReportsTable;