import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import '../reports/styles/ReportsTable.css';

const ReportsTable = ({
  reports = [],
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onViewHistory = () => {}, 
  userRole = 'admin',
  viewMode = 'all'  // ✅ Add viewMode prop
}) => {
  return (
    <div className="table-container">
      <table className="reports-table">
        <TableHeader />
        <tbody>
          {reports.map((report, index) => (
            <TableRow
              key={`${report.id}-${index}`}
              report={report}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewHistory={onViewHistory}
              userRole={userRole}
              viewMode={viewMode}  // ✅ Pass viewMode
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsTable;