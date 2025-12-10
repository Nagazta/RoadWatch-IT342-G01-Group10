import { useEffect, useState } from "react";
import StatCard from './StatCard';
import {
  DocumentIcon,
  AlertIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon
} from '../common/Icons';
import '../dashboard/styles/DashboardStats.css';

const AdminDashboardStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_REPORTS_API_URL || import.meta.env.VITE_API_BASE_URL + '/api/reports';
    
    fetch(`${apiUrl}/getAll`)
      .then(res => res.json())
      .then(reports => {
        calculateStats(reports);
      })
      .catch(err => console.error("Error fetching reports:", err));
  }, []);

  const calculateStats = (reports) => {
    const total = reports.length;

    const pending = reports.filter(r => r.status === "Pending").length;
    const inProgress = reports.filter(r => r.status === "In-Progress").length;
    const resolved = reports.filter(r => r.status === "Resolved").length;

    // No resolvedAt available in entity → avg time cannot be computed
    const avgTime = "N/A";

    setStats({
      total,
      pending,
      inProgress,
      resolved,
      avgTime
    });
  };

  if (!stats) return <p>Loading stats...</p>;

  const statsData = [
    { id: 'total', icon: <DocumentIcon />, value: stats.total, label: 'Total Reports', iconColor: '#00695c' },
    { id: 'pending', icon: <AlertIcon />, value: stats.pending, label: 'Pending Reports', iconColor: '#f57f17' },
    { id: 'in-progress', icon: <ClockIcon />, value: stats.inProgress, label: 'In Progress', iconColor: '#1565c0' },
    { id: 'resolved', icon: <CheckCircleIcon />, value: stats.resolved, label: 'Resolved Reports', iconColor: '#2e7d32' },
    { id: 'avg-time', icon: <CalendarIcon />, value: stats.avgTime, label: 'Avg. Resolution Time', iconColor: '#512da8' },
  ];

  return (
    <div className="dashboard-stats">
      {statsData.map(stat => (
        <StatCard 
          key={stat.id} 
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          iconColor={stat.iconColor}
          variant="horizontal"
        />
      ))}
    </div>
  );
};

export default AdminDashboardStats;