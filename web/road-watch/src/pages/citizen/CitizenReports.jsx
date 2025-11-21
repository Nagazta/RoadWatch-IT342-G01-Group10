import React, { useEffect, useState } from 'react';
import reportService from '../../services/api/reportService';
import ReportsFilters from '../../components/reports/ReportsFilter';
import ReportsTable from '../../components/reports/ReportsTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import '../admin/styles/ReportsManagement.css';

const CitizenReports = () => 
{
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Report Details Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Mock citizen report data
  const citizenReports = [
    { id: 0, title: 'Large pothole on Main Street', category: 'Pothole', status: 'Under Review', date: '1/15/2024', location: 'Main St & 5th Ave', class: 'under-review', description: 'Deep pothole causing accidents on Main Street.' },
    { id: 1, title: 'Cracked pavement near school', category: 'Crack', status: 'Resolved', date: '1/12/2024', location: 'School Rd, Block 3', class: 'resolved', description: 'Cracked pavement near school entrance repaired last week.' },
    { id: 2, title: 'Debris blocking bike lane', category: 'Debris', status: 'Pending', date: '1/18/2024', location: 'Bike Path, Mile 2', class: 'pending', description: 'Construction debris obstructing bike lane access.' },
    { id: 3, title: 'Flooding after rain', category: 'Flooding', status: 'Rejected', date: '1/10/2024', location: 'Low St & Water Ave', class: 'rejected', description: 'Reported flooding after heavy rain, but not approved for cleanup.' },
    { id: 4, title: 'Road surface deterioration', category: 'Other', status: 'Under Review', date: '1/14/2024', location: 'Highway 101, Exit 5', class: 'under-review', description: 'Surface damage increasing over the last month.' }
  ];

  // Filtering logic
  const filteredReports = citizenReports.filter(report => {
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

  // Modal handling
  const handleView = (reportId) => {
    const report = citizenReports.find(r => r.id === reportId);
    setSelectedReport(report);
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedReport(null);
  };

  // Pagination (placeholder)
  const currentPage = 1;
  const totalPages = 1;

  // Test Implementation
  const [citizenReports2, setCitizenReports2] = useState([]);

  const fetchReports = async() =>
  {
    const user = localStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const name = parsedUser.name;

    const response = await reportService.getReportsByName(name);

    if(response.success)
    {
      console.log(response.data);
      setCitizenReports2(response.data);
    }
  }

  useEffect(() =>
  {
    fetchReports();

  }, []);

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
        reports={citizenReports2}
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
