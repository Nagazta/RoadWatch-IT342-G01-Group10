import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionsButton';
import '../reports/styles/ReportsTable.css';

const ReportsTable = ({
  reports = [],
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onViewHistory = () => {}, 
  userRole = 'admin'
}) => {
  if (reports.length === 0) {
    return (
      <div className="table-container">
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: '#666',
          fontSize: '16px'
        }}>
          No reports found
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="table-container table-view">
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
                userRole={userRole}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="cards-container cards-view">
        {reports.map((report, index) => (
          <div key={`${report.id}-${index}`} className="report-card">
            <div className="report-card-header">
              <div className="report-card-title">{report.title}</div>
              <StatusBadge status={report.status} />
            </div>
            <div className="report-card-body">
              <div className="report-card-row">
                <span className="report-card-label">ID:</span>
                <span className="report-card-value">{report.id}</span>
              </div>
              <div className="report-card-row">
                <span className="report-card-label">Category:</span>
                <span className="report-card-value">{report.category}</span>
              </div>
              <div className="report-card-row">
                <span className="report-card-label">Submitted By:</span>
                <span className="report-card-value">{report.submittedByName || report.submittedBy}</span>
              </div>
              <div className="report-card-row">
                <span className="report-card-label">Date:</span>
                <span className="report-card-value">
                  {new Date(report.dateSubmitted).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <div className="report-card-footer">
              <ActionButtons
                reportId={report.id}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                userRole={userRole}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReportsTable;