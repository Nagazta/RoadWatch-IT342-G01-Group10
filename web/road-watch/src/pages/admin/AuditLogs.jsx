import React, { useState } from 'react';
import AuditLogsFilters from '../../components/audit/AuditLogsFilters';
import AuditLogsTable from '../../components/audit/AuditLogsTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import '../admin/styles/AuditLogs.css';

const AuditLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('All Activities');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data
  const auditLogs = [
    { id: 'AL-1001', user: 'Adrian Lopez', userRole: 'Admin', action: 'User Modification', description: 'Updated role of Kyle Sumucad from Citizen to Moderator', dateTime: 'Oct 20, 2025 • 08:34 AM', status: 'Success' },
    { id: 'AL-1002', user: 'Kyle Sumucad', userRole: 'Moderator', action: 'Report Update', description: 'Changed status of RW-00126 to "Resolved"', dateTime: 'Oct 20, 2025 • 09:15 AM', status: 'Success' },
    { id: 'AL-1003', user: 'Maria Santos', userRole: 'Citizen', action: 'Login', description: 'Logged in via web portal', dateTime: 'Oct 20, 2025 • 09:25 AM', status: 'Success' },
    { id: 'AL-1004', user: 'John Dela Cruz', userRole: 'Citizen', action: 'Report Submission', description: 'Submitted a new report: Deep Pothole on Osmeña Blvd', dateTime: 'Oct 20, 2025 • 09:30 AM', status: 'Success' },
    { id: 'AL-1005', user: 'System', userRole: 'System', action: 'Automated Process', description: 'Cleaned up expired sessions', dateTime: 'Oct 20, 2025 • 09:45 AM', status: 'System' },
    { id: 'AL-1006', user: 'Gab Saniel', userRole: 'Citizen', action: 'Login', description: 'Failed login attempt – incorrect password', dateTime: 'Oct 20, 2025 • 10:05 AM', status: 'Failed' },
    { id: 'AL-1007', user: 'Adrian Lopez', userRole: 'Admin', action: 'System Change', description: 'Updated site configuration (SMTP settings)', dateTime: 'Oct 20, 2025 • 10:25 AM', status: 'Success' },
    { id: 'AL-1008', user: 'Robert Tan', userRole: 'Moderator', action: 'Report Update', description: 'Marked report RW-00128 as "In Progress"', dateTime: 'Oct 20, 2025 • 10:40 AM', status: 'Success' },
    { id: 'AL-1009', user: 'System', userRole: 'System', action: 'Notification', description: 'Sent email summary to admin team', dateTime: 'Oct 20, 2025 • 10:50 AM', status: 'System' },
    { id: 'AL-1010', user: 'Nina Velasquez', userRole: 'Citizen', action: 'Account Update', description: 'Updated profile picture and contact info', dateTime: 'Oct 20, 2025 • 11:00 AM', status: 'Success' },
  ];

  const handleDateRange = () => {
    console.log('Open date range picker');
  };

  const handleExportCSV = () => {
    console.log('Export CSV');
  };

  const handleExportPDF = () => {
    console.log('Export PDF');
  };

  return (
    <div className="audit-logs-container">      
      <AuditLogsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedActivity={selectedActivity}
        onActivityChange={setSelectedActivity}
        onDateRange={handleDateRange}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
      />

      <AuditLogsTable logs={auditLogs} />

      <ReportsPagination
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        currentPage={1}
        totalPages={1}
      />
    </div>
  );
};

export default AuditLogs;