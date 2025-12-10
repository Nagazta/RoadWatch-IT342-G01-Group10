import React, { useState, useEffect } from 'react';
import AuditLogsFilters from '../../components/audit/AuditLogsFilters';
import AuditLogsTable from '../../components/audit/AuditLogsTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import { fetchAuditLogs, exportAuditLogsCSV } from '../../services/api/auditLogService.js';
import '../admin/styles/AuditLogs.css';

const AuditLogs = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('All Activities');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Fetch audit logs
  const loadAuditLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAuditLogs({
        search: searchQuery,
        activity: selectedActivity,
        startDate: dateRange.start,
        endDate: dateRange.end,
        page: currentPage,
        size: rowsPerPage
      });

      setAuditLogs(result.logs);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Error loading audit logs:', err);
      setError(err.message);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Load logs on component mount and filter changes
  useEffect(() => {
    loadAuditLogs();
  }, [currentPage, rowsPerPage, selectedActivity, dateRange]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 0) {
        setCurrentPage(0); // Reset to first page on search
      } else {
        loadAuditLogs();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle date range selection
  const handleDateRange = () => {
    // Simple implementation - you can replace with a proper date picker
    const start = prompt('Enter start date (YYYY-MM-DDTHH:mm:ss) or leave empty:');
    const end = prompt('Enter end date (YYYY-MM-DDTHH:mm:ss) or leave empty:');
    
    setDateRange({
      start: start || null,
      end: end || null
    });
    setCurrentPage(0);
  };

  // Handle CSV export
  const handleExportCSV = async () => {
    try {
      await exportAuditLogsCSV({
        search: searchQuery,
        activity: selectedActivity,
        startDate: dateRange.start,
        endDate: dateRange.end
      });
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Failed to export CSV: ' + err.message);
    }
  };

  // Handle PDF export
  const handleExportPDF = () => {
    alert('PDF export is not yet implemented. Please use CSV export.');
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  };

  return (
    <div className="audit-logs-container">
      {/* Error Banner */}
      {error && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '16px',
          backgroundColor: '#fee',
          color: '#c00',
          borderRadius: '8px',
          border: '1px solid #fcc',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#c00'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <AuditLogsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedActivity={selectedActivity}
        onActivityChange={setSelectedActivity}
        onDateRange={handleDateRange}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
      />

      {/* Loading State */}
      {loading ? (
        <div style={{
          padding: '64px',
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p>Loading audit logs...</p>
        </div>
      ) : auditLogs.length === 0 ? (
        /* Empty State */
        <div style={{
          padding: '64px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          margin: '16px 0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ color: '#666', marginBottom: '8px' }}>No audit logs found</h3>
          <p style={{ color: '#999' }}>
            {searchQuery || selectedActivity !== 'All Activities' || dateRange.start
              ? 'Try adjusting your filters'
              : 'No audit logs have been recorded yet'}
          </p>
        </div>
      ) : (
        /* Audit Logs Table */
        <AuditLogsTable logs={auditLogs} />
      )}

      {/* Pagination */}
      {!loading && auditLogs.length > 0 && (
        <ReportsPagination
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuditLogs;