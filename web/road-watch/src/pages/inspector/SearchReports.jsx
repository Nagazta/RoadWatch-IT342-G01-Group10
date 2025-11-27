import { useState } from 'react';
import ReportFilterPanel from '../../components/reports/ReportFilterPanel';
import ReportsTable from '../../components/reports/ReportsTable';
import reportService from '../../services/api/reportService';
import '../admin/styles/ReportsManagement.css';
import './styles/InspectorStyles.css';

const SearchReports = () => {
  const [filter, setFilter] = useState({});
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Function to call backend for search
  const fetchFilteredReports = async (filters) => {
    setLoading(true);
    setError('');
    // Build params for /api/reports/getAll endpoint (simple approach: fetch all and filter in JS)
    // For best scale, update backend API to support filtered fetch if needed
    try {
      const res = await reportService.getAllReports();
      if (res.success) {
        let filtered = res.data;
        if (filters.title) filtered = filtered.filter(r => r.title && r.title.toLowerCase().includes(filters.title.toLowerCase()));
        if (filters.status) filtered = filtered.filter(r => r.status === filters.status);
        if (filters.category) filtered = filtered.filter(r => r.category === filters.category);
        if (filters.location) filtered = filtered.filter(r => r.location && r.location.toLowerCase().includes(filters.location.toLowerCase()));
        if (filters.reporter) filtered = filtered.filter(r => (r.submittedByName || r.submittedBy || '').toLowerCase().includes(filters.reporter.toLowerCase()));
        if (filters.from) filtered = filtered.filter(r => new Date(r.dateSubmitted || r.createdAt) >= new Date(filters.from));
        if (filters.to) filtered = filtered.filter(r => new Date(r.dateSubmitted || r.createdAt) <= new Date(filters.to));
        setReports(filtered);
      } else {
        setError('Unable to fetch reports');
        setReports([]);
      }
    } catch {
      setError('Error contacting backend');
      setReports([]);
    }
    setLoading(false);
  };

  const handleFilterChange = (upd) => {
    setFilter(upd);
    fetchFilteredReports(upd);
  };

  return (
    <div className="dashboard-container inspector-page">
      <div className="inspector-section inspector-section--compact">
        <ReportFilterPanel onFilterChange={handleFilterChange} />
        <div style={{marginTop: 30}}>
          <h3 style={{marginBottom: 18, marginLeft: 4}}>Results</h3>
          {loading ? (
            <div>Loading reports...</div>
          ) : error ? (
            <div style={{color:'red'}}>{error}</div>
          ) : (
            <ReportsTable reports={reports} userRole="inspector" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchReports;
