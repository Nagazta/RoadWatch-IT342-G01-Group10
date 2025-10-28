import AdminDashboardStats from '../../components/dashboard/AdminDashboardStats';
import ReportsByStatus from '../../components/dashboard/ReportsByStatus';
import ReportsOverTime from '../../components/dashboard/ReportsOverTime';
import TopReportedLocations from '../../components/dashboard/TopReportedLocations';
import '../admin/styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">

      <AdminDashboardStats />

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-item">
          <ReportsByStatus />
        </div>
        <div className="chart-item">
          <ReportsOverTime />
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <TopReportedLocations />
      </div>
    </div>
  );
};

export default Dashboard;
