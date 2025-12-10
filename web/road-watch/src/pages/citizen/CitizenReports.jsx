import React, { useEffect, useState } from 'react';
import reportService from '../../services/api/reportService';
import ReportsFilters from '../../components/reports/ReportsFilter';
import ReportsTable from '../../components/reports/ReportsTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import ReportDetailsModal from '../../components/modal/ReportDetailsModal';
import ViewHistoryModal from '../../components/modal/ViewHistoryModal';  // ✅ Import history modal
import axios from 'axios';
import '../admin/styles/ReportsManagement.css';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CitizenReports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Report Details Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // ✅ History Modal state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const [reports, setReports] = useState([]);

  const fetchReportsAndUsers = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      // 1️⃣ Fetch all users
      const usersRes = await axios.get(`${API_URL}/api/users/getAll`);
      const allUsers = usersRes.data;

      // 2️⃣ Fetch reports
      let response;
      if (user.role === 'admin') {
        response = await reportService.getAllReports();
      } else {
        response = await reportService.getReportsByEmail(user.email);
      }

      if (response.success) {
        // 3️⃣ Map submittedBy email to full name and format dates
        const mappedReports = response.data.map((report) => {
          const matchedUser = allUsers.find(u => u.email === report.submittedBy);
          return {
            ...report,
            submittedByName: matchedUser ? matchedUser.name : report.submittedBy,
            dateSubmitted: report.dateSubmitted 
              ? new Date(report.dateSubmitted).toLocaleDateString() 
              : 'N/A'
          };
        });

        setReports(mappedReports);
      }
    } catch (error) {
      console.error('Failed to fetch reports or users:', error);
    }
  };

  useEffect(() => {
    fetchReportsAndUsers();
  }, []);

  // Filter logic
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All Categories' || report.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All Statuses' || report.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Report Details Modal handlers
  const handleView = (reportId) => {
    console.log('📋 Opening report modal for ID:', reportId);
    const report = reports.find((r) => r.id === reportId);
    
    if (report) {
      const formattedReport = {
        ...report,
        submittedBy: report.submittedByName || report.submittedBy,
        dateSubmitted: report.dateSubmitted || new Date(report.createdAt).toLocaleDateString()
      };
      
      console.log('📋 Report data:', formattedReport);
      setSelectedReport(formattedReport);
      setIsReportModalOpen(true);
    } else {
      console.error('❌ Report not found:', reportId);
    }
  };

  const handleCloseReportModal = () => {
    console.log('✖️ Closing report modal');
    setIsReportModalOpen(false);
    setSelectedReport(null);
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
    <div className="reports-management-container">
      <ReportsFilters
        userRole="citizen"
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
        onViewHistory={handleViewHistory}  // ✅ Add this prop
        userRole="citizen"
      />

      <ReportsPagination
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Report Details Modal */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        mode="view"
      />

      {/* ✅ History Modal */}
      {isHistoryModalOpen && (
        <ViewHistoryModal
          reportId={selectedReportId}
          onClose={handleCloseHistoryModal}
        />
      )}
    </div>
  );
};

export default CitizenReports;
