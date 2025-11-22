import { useMemo, useState } from 'react';
import ReportsFilters from '../../components/reports/ReportsFilter';
import ReportsTable from '../../components/reports/ReportsTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import '../admin/styles/ReportsManagement.css';
import './styles/InspectorStyles.css';

const assignedReports = [
  {
    id: 'AR-201',
    title: 'Pothole on 5th St',
    category: 'Pothole',
    submittedBy: 'Jane Doe',
    dateSubmitted: '2024-03-18',
    status: 'In Progress'
  },
  {
    id: 'AR-202',
    title: 'Flooded crosswalk',
    category: 'Flooding',
    submittedBy: 'Ben Smith',
    dateSubmitted: '2024-03-17',
    status: 'Pending'
  },
  {
    id: 'AR-203',
    title: 'Loose manhole cover',
    category: 'Debris',
    submittedBy: 'Olivia Cruz',
    dateSubmitted: '2024-03-16',
    status: 'Pending'
  },
  {
    id: 'AR-204',
    title: 'Lane markings faded',
    category: 'Other',
    submittedBy: 'Ken Tan',
    dateSubmitted: '2024-03-15',
    status: 'Resolved'
  },
  {
    id: 'AR-205',
    title: 'Street light flickering',
    category: 'Lighting',
    submittedBy: 'Maya Flores',
    dateSubmitted: '2024-03-14',
    status: 'In Progress'
  }
];

const AssignedReports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReports = useMemo(() => {
    return assignedReports.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All Categories' || report.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'All Statuses' || report.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

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
    console.log('View assigned report', reportId);
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
      </div>
    </div>
  );
};
export default AssignedReports;
