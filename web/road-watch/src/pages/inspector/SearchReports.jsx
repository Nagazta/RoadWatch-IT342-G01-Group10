import ReportFilterPanel from '../../components/reports/ReportFilterPanel';
import '../admin/styles/ReportsManagement.css';
import './styles/InspectorStyles.css';

const SearchReports = () => (
  <div className="dashboard-container inspector-page">
    <div className="inspector-section inspector-section--compact">
      <ReportFilterPanel />
    </div>
  </div>
);

export default SearchReports;
