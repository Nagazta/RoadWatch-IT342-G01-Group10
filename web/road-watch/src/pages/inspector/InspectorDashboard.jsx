import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import ReportsFilters from '../../components/reports/ReportsFilter';
import ReportsTable from '../../components/reports/ReportsTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import InspectorDashboardStats from '../../components/dashboard/InspectorDashboardStats';
import ReportDetailsModal from '../../components/modal/ReportDetailsModal';
import ViewHistoryModal from '../../components/modal/ViewHistoryModal';  // ✅ Import history modal
import reportService from '../../services/api/reportService';
import '../admin/styles/Dashboard.css';
import '../admin/styles/ReportsManagement.css';
import './styles/InspectorStyles.css';

const InspectorDashboard = () => {
  const [allReports, setAllReports] = useState([]);
  const [assignedReports, setAssignedReports] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'assigned'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchErr, setFetchErr] = useState('');
  const [fetching, setFetching] = useState(false);
  
  // Modal state
  const [viewingReport, setViewingReport] = useState(null);
  
  // ✅ History Modal state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
    fetchAllReports();
    fetchAssignedReports();
  }, []);

  const fetchAllReports = async () => {
    setFetching(true);
    setFetchErr('');
    const res = await reportService.getAllReports();
    setFetching(false);
    if (res.success) {
      setAllReports(Array.isArray(res.data) ? res.data : []);
    } else {
      setFetchErr('Failed to fetch all reports');
    }
  };

  const fetchAssignedReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const inspectorId = localStorage.getItem('adminId');
      const roleData = JSON.parse(localStorage.getItem('roleData') || '{}');
      
      const actualInspectorId = roleData.inspector_id || inspectorId;

      const response = await axios.get(
        `http://localhost:8080/api/reports/inspector/${actualInspectorId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      console.log('✅ Fetched assigned reports:', response.data);
      setAssignedReports(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('❌ Failed to fetch assigned reports:', err);
      // Don't show error for assigned reports, just keep empty array
    }
  };

  // Determine which reports to display based on view mode
  const displayReports = viewMode === 'all' ? allReports : assignedReports;

  const filteredReports = useMemo(() => {
    return displayReports.filter((report) => {
      const matchesSearch =
        report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.submittedBy?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All Categories' || report.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'All Statuses' || report.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [displayReports, searchQuery, selectedCategory, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / rowsPerPage));
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setCurrentPage(1); // Reset to first page when switching modes
    // Reset filters
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedStatus('All Statuses');
  };

  const handleView = (reportId) => {
    const report = displayReports.find(r => r.id === reportId);
    if (report) {
      console.log('👁️ Viewing report:', report);
      setViewingReport(report);
    }
  };

  // ✅ History Modal handlers
  const handleViewHistory = (reportId) => {
    console.log('📜 Opening history modal for report ID:', reportId);
    setSelectedReportId(reportId);
    setIsHistoryModalOpen(true);
  };

  const handleCloseHistoryModal = () => {
    console.log('✖️ Closing history modal');
    setIsHistoryModalOpen(false);
    setSelectedReportId(null);
  };

  return (
    <div className="dashboard-container inspector-page">
      <InspectorDashboardStats />
      
      <div className="reports-management-container">
        {/* View Mode Toggle Buttons */}
        <div className="view-mode-toggle" style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          padding: '16px 0',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <button
            onClick={() => handleViewModeChange('all')}
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: viewMode === 'all' ? '#3b82f6' : '#f3f4f6',
              color: viewMode === 'all' ? '#ffffff' : '#6b7280',
              boxShadow: viewMode === 'all' ? '0 2px 4px rgba(59, 130, 246, 0.3)' : 'none'
            }}
          >
            All Reports ({allReports.length})
          </button>
          <button
            onClick={() => handleViewModeChange('assigned')}
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: viewMode === 'assigned' ? '#10b981' : '#f3f4f6',
              color: viewMode === 'assigned' ? '#ffffff' : '#6b7280',
              boxShadow: viewMode === 'assigned' ? '0 2px 4px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            My Assigned Reports ({assignedReports.length})
          </button>
        </div>

        {/* Page Header */}
        <div className="page-header" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
            {viewMode === 'all' ? 'All Reports' : 'My Assigned Reports'}
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            {viewMode === 'all' 
              ? `Viewing all reports in the system (${filteredReports.length} ${filteredReports.length === 1 ? 'report' : 'reports'})`
              : `Viewing your assigned inspection reports (${filteredReports.length} ${filteredReports.length === 1 ? 'report' : 'reports'})`
            }
          </p>
        </div>

        <ReportsFilters
          userRole="inspector"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
        
        {fetching ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#6b7280',
            fontSize: '14px' 
          }}>
            Loading reports...
          </div>
        ) : fetchErr ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#ef4444',
            fontSize: '14px',
            backgroundColor: '#fef2f2',
            borderRadius: '8px',
            border: '1px solid #fecaca'
          }}>
            {fetchErr}
          </div>
        ) : filteredReports.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#6b7280',
            fontSize: '14px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            {viewMode === 'assigned' 
              ? 'No reports assigned to you yet.'
              : 'No reports found matching your filters.'
            }
          </div>
        ) : (
          <ReportsTable
            reports={paginatedReports}
            onView={handleView}
            onViewHistory={handleViewHistory}
            userRole="inspector"
            viewMode={viewMode}  
          />
        )}
        
        <ReportsPagination
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* View Modal */}
        {viewingReport && (
          <ReportDetailsModal
            report={viewingReport}
            isOpen={!!viewingReport}
            onClose={() => setViewingReport(null)}
            mode="view"  // ✅ Inspectors can only view (not edit) from "All Reports"
          />
        )}

        {/* ✅ History Modal */}
        {isHistoryModalOpen && (
          <ViewHistoryModal
            reportId={selectedReportId}
            onClose={handleCloseHistoryModal}
          />
        )}
      </div>
    </div>
  );
};

export default InspectorDashboard;