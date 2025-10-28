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
    { icon: <DocumentIcon />, value: 1247, label: 'Total Reports', bgColor: '#e8f5e9' },
    { icon: <AlertIcon />, value: 89, label: 'Pending Reports', bgColor: '#fff9c4' },
    { icon: <ClockIcon />, value: 156, label: 'In Progress', bgColor: '#e0f7fa' },
    { icon: <CheckCircleIcon />, value: 1002, label: 'Resolved Reports', bgColor: '#e8f5e9' },
    { icon: <CalendarIcon />, value: '3.2 days', label: 'Avg Resolution Time', bgColor: '#fff9c4' }
  ];

  return (
    <div className="dashboard-stats">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          bgColor={stat.bgColor}
        />
      ))}
    </div>
  );
};

export default AdminDashboardStats;
