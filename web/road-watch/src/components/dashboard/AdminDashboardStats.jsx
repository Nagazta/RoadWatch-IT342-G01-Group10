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
const statsData = [
    { id: 'total', icon: <DocumentIcon />, value: 1247, label: 'Total Reports', iconColor: '#00695c' },
    { id: 'pending', icon: <AlertIcon />, value: 89, label: 'Pending Reports', iconColor: '#f57f17' },
    { id: 'in-progress', icon: <ClockIcon />, value: 156, label: 'In Progress', iconColor: '#1565c0' },
    { id: 'resolved', icon: <CheckCircleIcon />, value: 1002, label: 'Resolved Reports', iconColor: '#2e7d32' },
    { id: 'avg-time', icon: <CalendarIcon />, value: '3.2 days', label: 'Avg Resolution Time', iconColor: '#00695c' }
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
