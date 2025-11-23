import CitizenDashboardStats from "../../components/dashboard/CitizenDashboardStats";
import TopReportedLocations from "../../components/dashboard/TopReportedLocations";
import CitizenRecentActivity from "../../components/dashboard/CitizenRecentActivity";
import '../admin/styles/Dashboard.css';
import './styles/CitizenDashboard.css';

const CitizenDashboard = () =>
{
    return (
        <div className="dashboard-container">
            <CitizenDashboardStats />

            <div className="location-activity">
                <TopReportedLocations />
                <CitizenRecentActivity />
            </div>

        </div>
    );
};

export default CitizenDashboard;