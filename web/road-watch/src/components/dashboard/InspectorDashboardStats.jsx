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
  const statsData = [
    {
      id: 'assigned',
      icon: <AssignmentIcon />,
      value: 32,
      label: 'Assigned Reports',
      iconColor: '#00695c'
    },
    {
      id: 'in-progress',
      icon: <ClockIcon />,
      value: 12,
      label: 'In Progress',
      iconColor: '#1565c0'
    },
    {
      id: 'pending',
      icon: <AlertIcon />,
      value: 9,
      label: 'Pending Review',
      iconColor: '#f57f17'
    },
    {
      id: 'resolved',
      icon: <CheckCircleIcon />,
      value: 11,
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

