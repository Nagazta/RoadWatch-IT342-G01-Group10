import StatCard from './StatCard';
import {
  AssignmentIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertIcon
} from '../common/Icons';
import '../dashboard/styles/DashboardStats.css';
import '../dashboard/styles/CitizenDashboardStats.css';

const InspectorDashboardStats = ({ reports = [] }) => {
  // Calculate stats based on reports prop
  const totalAssigned = reports.length;
  const inProgress = reports.filter(r => ['In-Progress', 'In Progress'].includes(r.status)).length;
  const pending = reports.filter(r => r.status === 'Pending').length;
  const resolved = reports.filter(r => r.status === 'Resolved').length;

  const statsData = [
    {
      id: 'assigned',
      icon: <AssignmentIcon />,
      value: totalAssigned,
      label: 'Assigned Reports',
      iconColor: '#00695c'
    },
    {
      id: 'in-progress',
      icon: <ClockIcon />,
      value: inProgress,
      label: 'In Progress',
      iconColor: '#1565c0'
    },
    {
      id: 'pending',
      icon: <AlertIcon />,
      value: pending,
      label: 'Pending Review',
      iconColor: '#f57f17'
    },
    {
      id: 'resolved',
      icon: <CheckCircleIcon />,
      value: resolved,
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

