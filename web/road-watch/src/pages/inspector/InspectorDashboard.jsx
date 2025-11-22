import { useMemo, useState } from 'react';
import ReportsFilters from '../../components/reports/ReportsFilter';
import ReportsTable from '../../components/reports/ReportsTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import InspectorDashboardStats from '../../components/dashboard/InspectorDashboardStats';
import '../admin/styles/Dashboard.css';
import '../admin/styles/ReportsManagement.css';
import './styles/InspectorStyles.css';

const inspectorReports = [
  {
    id: 'RW-301',
    title: 'Large Pothole on Main Street',
    category: 'Pothole',
    submittedBy: 'John Smith',
    dateSubmitted: '2024-04-10',
    status: 'Pending'
  },
  {
    id: 'RW-302',
    title: 'Sidewalk Crack Near School',
    category: 'Crack',
    submittedBy: 'Sarah Johnson',
    dateSubmitted: '2024-04-09',
    status: 'In Progress'
  },
  {
    id: 'RW-303',
    title: 'Damaged Street Sign',
    category: 'Signage',
    submittedBy: 'Mike Davis',
    dateSubmitted: '2024-04-08',
    status: 'Resolved'
  },
  {
    id: 'RW-304',
    title: 'Broken Street Light',
    category: 'Lighting',
    submittedBy: 'Lisa Wilson',
    dateSubmitted: '2024-04-07',
    status: 'Pending'
  },
  {
    id: 'RW-305',
    title: 'Road Surface Deterioration',
    category: 'Other',
    submittedBy: 'Tom Brown',
    dateSubmitted: '2024-04-06',
    status: 'Rejected'
  },
  {
    id: 'RW-306',
    title: 'Blocked Storm Drain',
    category: 'Flooding',
    submittedBy: 'Emma Garcia',
    dateSubmitted: '2024-04-05',
    status: 'Pending'
  },
  {
    id: 'RW-307',
    title: 'Deep Pothole Emergency',
    category: 'Pothole',
    submittedBy: 'David Lee',
    dateSubmitted: '2024-04-04',
    status: 'In Progress'
  },
  {
    id: 'RW-308',
    title: 'Damaged Curb Section',
    category: 'Debris',
    submittedBy: 'Rachel Martinez',
    dateSubmitted: '2024-04-03',
    status: 'Resolved'
  }
];

const InspectorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReports = useMemo(() => {
    return inspectorReports.filter((report) => {
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
    console.log('View report', reportId);
  };

  return (
    <div className="dashboard-container inspector-page">
      <InspectorDashboardStats />

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

export default InspectorDashboard;
