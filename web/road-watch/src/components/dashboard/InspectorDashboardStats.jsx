import { useEffect, useState } from 'react';
import StatCard from './StatCard';
import {
  AssignmentIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertIcon
} from '../common/Icons';
import '../dashboard/styles/DashboardStats.css';
import '../dashboard/styles/CitizenDashboardStats.css';

const InspectorDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInspectorStats();
  }, []);

  const fetchInspectorStats = async () => {
    try {
      // Get the logged-in inspector's info
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      
      if (!user || !token) {
        throw new Error('No user or token found');
      }

      // Fetch inspector's assigned reports
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiUrl}/api/reports/getMyAssignedReport`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assigned reports');
      }

      const assignedReports = await response.json();
      
      calculateStats(assignedReports);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching inspector stats:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const calculateStats = (reports) => {
    // Total assigned to this inspector
    const assigned = reports.length;

    // Count by status
    const inProgress = reports.filter(r => 
      r.status === 'In-Progress' || r.status === 'In Progress'
    ).length;

    const pending = reports.filter(r => 
      r.status === 'Pending'
    ).length;

    const resolved = reports.filter(r => 
      r.status === 'Resolved'
    ).length;

    setStats({
      assigned,
      inProgress,
      pending,
      resolved
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-stats citizen-ds">
        <p>Loading inspector statistics...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-stats citizen-ds">
        <p style={{ color: 'red' }}>Error loading stats: {error}</p>
      </div>
    );
  }

  // No stats yet
  if (!stats) {
    return (
      <div className="dashboard-stats citizen-ds">
        <p>No statistics available</p>
      </div>
    );
  }

  const statsData = [
    {
      id: 'assigned',
      icon: <AssignmentIcon />,
      value: stats.assigned,
      label: 'Assigned Reports',
      iconColor: '#00695c'
    },
    {
      id: 'in-progress',
      icon: <ClockIcon />,
      value: stats.inProgress,
      label: 'In Progress',
      iconColor: '#1565c0'
    },
    {
      id: 'pending',
      icon: <AlertIcon />,
      value: stats.pending,
      label: 'Pending Review',
      iconColor: '#f57f17'
    },
    {
      id: 'resolved',
      icon: <CheckCircleIcon />,
      value: stats.resolved,
      label: 'Resolved by Inspector',
      iconColor: '#2e7d32'
    }
  ];

  return (
    <div className="dashboard-stats citizen-ds">
      {statsData.map((stat) => (
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

export default InspectorDashboardStats;