import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import ReportsFilters from '../../components/reports/ReportsFilter';
import ReportsTable from '../../components/reports/ReportsTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import EditReportModal from '../../components/modal/EditReportModal';
import ViewHistoryModal from '../../components/modal/ViewHistoryModal';
import ReportDetailsModal from '../../components/modal/ReportDetailsModal'; // ✅ Import the view modal
import '../admin/styles/ReportsManagement.css';
import './styles/InspectorStyles.css';

const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
const AssignedReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [editingReport, setEditingReport] = useState(null);
  const [viewingHistory, setViewingHistory] = useState(null);
  const [viewingReport, setViewingReport] = useState(null); // ✅ New state for view modal

  useEffect(() => {
    fetchAssignedReports();
  }, []);

  const fetchAssignedReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const inspectorId = localStorage.getItem('adminId');
      const roleData = JSON.parse(localStorage.getItem('roleData') || '{}');

      console.log('🔍 Inspector ID:', inspectorId);
      console.log('🔍 Role Data:', roleData);

      const actualInspectorId = roleData.inspector_id || inspectorId;

      const response = await axios.get(
        `${baseUrl}/reports/inspector/${actualInspectorId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      console.log('✅ Fetched reports:', response.data);
      setReports(response.data);
      setError(null);
    } catch (err) {
      console.error('❌ Failed to fetch reports:', err);
      setError('Failed to load assigned reports');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (report.submittedBy || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All Categories' || report.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'All Statuses' || report.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [reports, searchQuery, selectedCategory, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / rowsPerPage));
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // ✅ Implement handleView function
  const handleView = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      console.log('👁️ Viewing report:', report);
      setViewingReport(report);
    }
  };

  const handleEdit = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setEditingReport(report);
    }
  };

  const handleSaveEdit = async (reportId, updateData) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('adminId');

      const payload = {
        ...updateData,
        updatedBy: userId
      };

      await axios.put(
        `${baseUrl}/reports/${reportId}`,
        payload,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      await fetchAssignedReports();

      console.log('✅ Report updated successfully');
      alert('Report updated successfully!');
    } catch (error) {
      console.error('❌ Failed to update report:', error);
      throw error;
    }
  };

  const handleViewHistory = (reportId) => {
    setViewingHistory(reportId);
  };

  if (loading) {
    return (
      <div className="dashboard-container inspector-page">
        <div className="loading-state">Loading assigned reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container inspector-page">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchAssignedReports}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container inspector-page">
      <div className="reports-management-container">
        <ReportsFilters
          userRole="inspector"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        <ReportsTable
          reports={paginatedReports}
          onView={handleView}
          onEdit={handleEdit}
          onViewHistory={handleViewHistory}
          userRole="inspector"
          viewMode="assigned"
        />

        <ReportsPagination
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* ✅ View Modal - Read-only mode */}
        {viewingReport && (
          <ReportDetailsModal
            report={viewingReport}
            isOpen={!!viewingReport}
            onClose={() => setViewingReport(null)}
            mode="view"
          />
        )}

        {/* Edit Modal */}
        {editingReport && (
          <EditReportModal
            report={editingReport}
            onClose={() => setEditingReport(null)}
            onSave={handleSaveEdit}
          />
        )}

        {/* History Modal */}
        {viewingHistory && (
          <ViewHistoryModal
            reportId={viewingHistory}
            onClose={() => setViewingHistory(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AssignedReports;