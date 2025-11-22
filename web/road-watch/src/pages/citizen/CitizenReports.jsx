import React, { useEffect, useState } from 'react';
import reportService from '../../services/api/reportService';
import ReportsFilters from '../../components/reports/ReportsFilter';
import ReportsTable from '../../components/reports/ReportsTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import axios from 'axios';
import '../admin/styles/ReportsManagement.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const CitizenReports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

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
        // 3️⃣ Map submittedBy email to full name using allUsers
        const mappedReports = response.data.map((report) => {
          const matchedUser = allUsers.find(u => u.email === report.submittedBy);
          return {
            ...report,
            submittedByName: matchedUser ? matchedUser.name : report.submittedBy
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

  // Modal handlers
  const handleView = (reportId) => {
    const report = reports.find((r) => r.id === reportId);
    setSelectedReport(report);
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedReport(null);
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
        reports={filteredReports}
        onView={handleView}
        userRole="citizen"
      />

      <ReportsPagination
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    </div>
  );
};

export default CitizenReports;