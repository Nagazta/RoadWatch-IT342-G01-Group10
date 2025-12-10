import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReportsFilters from '../../components/reports/ReportsFilter';
import ReportsTable from '../../components/reports/ReportsTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import ReportDetailsModal from '../../components/modal/ReportDetailsModal';
import ConfirmationModal from '../../components/modal/ConfirmationModal';
import '../admin/styles/ReportsManagement.css';

const ReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportModalMode, setReportModalMode] = useState('view');

  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    reportId: null,
    reportTitle: ''
  });

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/reports/getAll`);
      console.log('API response:', response.data); // should log the JSON array
      const data = Array.isArray(response.data) ? response.data : [];
      // Sort by ID in descending order (highest ID first)
      const sortedData = data.sort((a, b) => b.id - a.id);
      setReports(sortedData);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };


  useEffect(() => {
    fetchReports();
  }, []);

  // Filtering
  const filteredReports = reports
    .filter(r => !selectedCategory || selectedCategory === 'All Categories' || r.category === selectedCategory)
    .filter(r => !selectedStatus || selectedStatus === 'All Statuses' || r.status === selectedStatus)
    .filter(r => r.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Modal handlers
  const handleView = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;
    setSelectedReport(report);
    setReportModalMode('view');
    setIsReportModalOpen(true);
  };

  const handleEdit = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;
    setSelectedReport(report);
    setReportModalMode('edit');
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setSelectedReport(null);
    setIsReportModalOpen(false);
  };

  const handleSaveReport = async (updatedReport) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/reports/update/${updatedReport.id}`, updatedReport);
      setReports(prev => prev.map(r => r.id === updatedReport.id ? response.data : r));
      handleCloseReportModal();
    } catch (error) {
      console.error('Failed to save report:', error);
    }
  };

  // Delete handlers
  const handleDelete = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;
    setDeleteConfirmation({
      isOpen: true,
      reportId,
      reportTitle: report.title
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/reports/delete/${deleteConfirmation.reportId}`
      );
      setReports(prev => prev.filter(r => r.id !== deleteConfirmation.reportId));
    } catch (error) {
      console.error('Failed to delete report:', error);
    } finally {
      setDeleteConfirmation({ isOpen: false, reportId: null, reportTitle: '' });
    }
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, reportId: null, reportTitle: '' });
  };

  // Optional: CSV, PDF, Date Range
  const handleExportCSV = () => console.log('Export CSV');
  const handleExportPDF = () => console.log('Export PDF');
  const handleDateRange = () => console.log('Open date range picker');

  return (
    <div className="reports-management-container">
      <ReportsFilters
        userRole="admin"
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
        reports={paginatedReports}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        userRole="admin"
      />

      <ReportsPagination
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ReportDetailsModal
        report={selectedReport}
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        onSave={handleSaveReport}
        mode={reportModalMode}
      />

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
