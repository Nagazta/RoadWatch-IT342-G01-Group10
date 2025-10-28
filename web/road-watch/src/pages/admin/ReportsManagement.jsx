// src/pages/admin/ReportsManagement.jsx
import React, { useState } from 'react';
import ReportsFilters from '../../components/reports/ReportsFilter';
import ReportsTable from '../../components/reports/ReportsTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import './ReportsManagement.css';

const ReportsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data
  const reports = [
    { id: 'RW-00124', title: 'Deep Pothole on Osmeña Blvd', category: 'Pothole', submittedBy: 'John Dela Cruz', date: 'Oct 18, 2025', status: 'Pending' },
    { id: 'RW-00125', title: 'Flooding near CIT-U Gate 3', category: 'Flooding', submittedBy: 'Maria Santos', date: 'Oct 19, 2025', status: 'In-Progress' },
    { id: 'RW-00126', title: 'Debris Blocking Road', category: 'Debris', submittedBy: 'Kyle Sumucad', date: 'Oct 20, 2025', status: 'Resolved' },
    { id: 'RW-00127', title: 'Road Crack near Ayala', category: 'Crack', submittedBy: 'Gab Saniel', date: 'Oct 21, 2025', status: 'Pending' },
    { id: 'RW-00128', title: 'Streetlight Not Working', category: 'Other', submittedBy: 'Adrian Lopez', date: 'Oct 21, 2025', status: 'In-Progress' },
    { id: 'RW-00128', title: 'Streetlight Not Working', category: 'Other', submittedBy: 'Adrian Lopez', date: 'Oct 21, 2025', status: 'In-Progress' },
    { id: 'RW-00127', title: 'Road Crack near Ayala', category: 'Crack', submittedBy: 'Gab Saniel', date: 'Oct 21, 2025', status: 'Pending' },
    { id: 'RW-00126', title: 'Debris Blocking Road', category: 'Debris', submittedBy: 'Kyle Sumucad', date: 'Oct 20, 2025', status: 'Resolved' },
    { id: 'RW-00126', title: 'Debris Blocking Road', category: 'Debris', submittedBy: 'Kyle Sumucad', date: 'Oct 20, 2025', status: 'Resolved' },
  ];

  const handleView = (reportId) => {
    console.log('View report:', reportId);
  };

  const handleEdit = (reportId) => {
    console.log('Edit report:', reportId);
  };

  const handleDelete = (reportId) => {
    console.log('Delete report:', reportId);
  };

  const handleExportCSV = () => {
    console.log('Export CSV');
  };

  const handleExportPDF = () => {
    console.log('Export PDF');
  };

  const handleDateRange = () => {
    console.log('Open date range picker');
  };

  return (
    <div className="reports-management-container">
      <ReportsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onDateRange={handleDateRange}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
      />

      <ReportsTable
        reports={reports}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ReportsPagination
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        currentPage={1}
        totalPages={1}
      />
    </div>
  );
};

export default ReportsManagement;