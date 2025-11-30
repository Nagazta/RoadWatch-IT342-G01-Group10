import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportsFilters from '../../components/reports/ReportsFilter';
import ReportsTable from '../../components/reports/ReportsTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import reportService from '../../services/api/reportService';
import '../admin/styles/ReportsManagement.css';
import './styles/InspectorStyles.css';

const AssignedReports = () => {
  const navigate = useNavigate();
  const [allReports, setAllReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignedReports = async () => {
      setLoading(true);
      setError('');
      const res = await reportService.getMyAssignedReports();
      setLoading(false);
      if (res.success) {
        setAllReports(Array.isArray(res.data) ? res.data : []);
      } else {
        setError(res.error || 'Failed to fetch assigned reports');
      }
    };
    fetchAssignedReports();
  }, []);

  const filteredReports = useMemo(() => {
    return allReports.filter((report) => {
      const matchesSearch =
        report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.submittedBy?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All Categories' || report.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'All Statuses' || report.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [allReports, searchQuery, selectedCategory, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / rowsPerPage));
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleView = (reportId) => {
    navigate(`/inspector/reports/${reportId}`);
  };

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

        {loading ? (
          <div>Loading assigned reports...</div>
        ) : error ? (
          <div style={{color:'red'}}>{error}</div>
        ) : (
          <>
            <ReportsTable
              reports={paginatedReports}
              onView={handleView}
              userRole="inspector"
            />

            <ReportsPagination
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};
export default AssignedReports;
