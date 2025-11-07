import StatCard from './StatCard';
import { DocumentIcon, AlertIcon, ClockIcon, CheckCircleIcon } from '../common/Icons';
import '../dashboard/styles/CitizenDashboardStats.css';

const CitizenDashboardStats = () =>
{
    const statsData =
    [
        { id: 'total', icon: <DocumentIcon />, value: 24, label: 'Total Reports', iconColor: '#00695c' },
        { id: 'pending', icon: <AlertIcon />, value: 8, label: 'Pending Reports', iconColor: '#f57f17' },
        { id: 'in-progress', icon: <ClockIcon />, value: 5, label: 'In Progress', iconColor: '#1565c0' },
        { id: 'resolved', icon: <CheckCircleIcon />, value: 11, label: 'Resolved Reports', iconColor: '#2e7d32' }
    ];

    return (
        <div className="dashboard-stats citizen-ds">
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

export default CitizenDashboardStats;