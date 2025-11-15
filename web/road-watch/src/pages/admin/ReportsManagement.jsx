import React, { useState } from 'react';
import ReportsFilters from '../../components/reports/ReportsFilter';
import ReportsTable from '../../components/reports/ReportsTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import ReportDetailsModal from '../../components/modal/ReportDetailsModal';
import ConfirmationModal from '../../components/modal/ConfirmationModal';
import '../admin/styles/ReportsManagement.css';

const ReportsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Report Details Modal states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportModalMode, setReportModalMode] = useState('view');

  // Delete Confirmation Modal state
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    reportId: null,
    reportTitle: ''
  });

  // Mock data - Enhanced with additional fields for modal
  const AdminReports = [
    { id: 'RW-00124', title: 'Deep Pothole on Osmeña Blvd', description: 'Large pothole causing vehicle damage on main boulevard.', category: 'Pothole', location: 'Osmeña Boulevard, Cebu City', submittedBy: 'John Dela Cruz', date: 'Oct 18, 2025', dateSubmitted: 'Oct 18, 2025', status: 'Pending', adminNotes: '' },
    { id: 'RW-00125', title: 'Flooding near CIT-U Gate 3', description: 'Severe flooding during heavy rain affecting traffic flow.', category: 'Flooding', location: 'CIT-U Gate 3, N. Bacalso Ave, Cebu City', submittedBy: 'Maria Santos', date: 'Oct 19, 2025', dateSubmitted: 'Oct 19, 2025', status: 'In Progress', adminNotes: 'Inspector assigned to evaluate drainage system' },
    { id: 'RW-00126', title: 'Debris Blocking Road', description: 'Construction debris blocking one lane of the road.', category: 'Debris', location: 'Mabolo, Cebu City', submittedBy: 'Kyle Sumucad', date: 'Oct 20, 2025', dateSubmitted: 'Oct 20, 2025', status: 'Resolved', adminNotes: 'Debris removed by maintenance team' },
    { id: 'RW-00127', title: 'Road Crack near Ayala', description: 'Large crack developing on main road near Ayala Center.', category: 'Crack', location: 'Cebu Business Park, Cebu City', submittedBy: 'Gab Saniel', date: 'Oct 21, 2025', dateSubmitted: 'Oct 21, 2025', status: 'Pending', adminNotes: '' },
    { id: 'RW-00128', title: 'Streetlight Not Working', description: 'Multiple streetlights not functioning in the area.', category: 'Street Light', location: 'Banilad, Cebu City', submittedBy: 'Adrian Lopez', date: 'Oct 21, 2025', dateSubmitted: 'Oct 21, 2025', status: 'In Progress', adminNotes: 'Electrical team dispatched' },
    { id: 'RW-00129', title: 'Missing Road Sign', description: 'Warning sign missing at dangerous curve.', category: 'Signage', location: 'Talamban, Cebu City', submittedBy: 'Nina Cruz', date: 'Oct 22, 2025', dateSubmitted: 'Oct 22, 2025', status: 'Pending', adminNotes: '' },
    { id: 'RW-00130', title: 'Sidewalk Damage', description: 'Broken sidewalk creating pedestrian hazard.', category: 'Crack', location: 'Lahug, Cebu City', submittedBy: 'Robert Tan', date: 'Oct 23, 2025', dateSubmitted: 'Oct 23, 2025', status: 'Resolved', adminNotes: 'Sidewalk repaired' },
    { id: 'RW-00131', title: 'Illegal Dump Site', description: 'Garbage being illegally dumped on roadside.', category: 'Other', location: 'Guadalupe, Cebu City', submittedBy: 'Linda Reyes', date: 'Oct 24, 2025', dateSubmitted: 'Oct 24, 2025', status: 'In Progress', adminNotes: 'Environmental team notified' },
    { id: 'RW-00132', title: 'Faded Road Markings', description: 'Lane markings severely faded and need repainting.', category: 'Other', location: 'IT Park, Cebu City', submittedBy: 'Jose Garcia', date: 'Oct 25, 2025', dateSubmitted: 'Oct 25, 2025', status: 'Pending', adminNotes: '' },
  ];

  // Open modal in VIEW mode
  const handleView = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    setSelectedReport(report);
    setReportModalMode('view');
    setIsReportModalOpen(true);
  };

  // Open modal in EDIT mode
  const handleEdit = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    setSelectedReport(report);
    setReportModalMode('edit');
    setIsReportModalOpen(true);
  };

  // Open delete confirmation modal
  const handleDelete = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    setDeleteConfirmation({
      isOpen: true,
      reportId: reportId,
      reportTitle: report.title
    });
  };

  // Confirm delete action
  const handleConfirmDelete = () => {
    console.log('Deleting report:', deleteConfirmation.reportId);
    // Add your delete logic here
    // For example:
    // - Make API call to delete report
    // - Update reports array
    // - Show success message
    
    // Close confirmation modal
    setDeleteConfirmation({
      isOpen: false,
      reportId: null,
      reportTitle: ''
    });
  };

  // Close delete confirmation modal
  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      reportId: null,
      reportTitle: ''
    });
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

  // Close report details modal
  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedReport(null);
  };

  // Save report changes
  const handleSaveReport = (updatedReport) => {
    console.log('Save report:', updatedReport);
    // Add your save logic here
    // For example:
    // - Make API call to update report
    // - Update reports array
    // - Show success message
    
    setIsReportModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="reports-management-container">
      <ReportsFilters
        userRole={'admin'}
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
        reports={AdminReports}
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

      {/* Report Details Modal */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        onSave={handleSaveReport}
        mode={reportModalMode}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleConfirmDelete}
        title="Delete Report?"
        message={`Are you sure you want to delete "${deleteConfirmation.reportTitle}"? This action cannot be undone.`}
        confirmText="Delete Report"
        type="delete"
      />
    </div>
  );
};

export default ReportsManagement;