import { useEffect, useState } from 'react';
import StatCard from './StatCard';
import reportService from '../../services/api/reportService';
import { DocumentIcon, AlertIcon, ClockIcon, CheckCircleIcon } from '../common/Icons';
import '../dashboard/styles/CitizenDashboardStats.css';

const CitizenDashboardStats = () =>
{
    const [citizenReports, setCitizenReports] = useState([]);
    const [totalReports, setTotalReports] = useState(0);
    const [pendingReports, setPendingReports] = useState(0);
    const [inProgressReports, setInProgressReports] = useState(0);
    const [resolvedReports, setResolvedReports] = useState(0);

    const statsData =
    [
        { id: 'total', icon: <DocumentIcon />, value: totalReports, label: 'Total Reports', iconColor: '#00695c' },
        { id: 'pending', icon: <AlertIcon />, value: pendingReports, label: 'Pending Reports', iconColor: '#f57f17' },
        { id: 'in-progress', icon: <ClockIcon />, value: inProgressReports, label: 'In Progress', iconColor: '#1565c0' },
        { id: 'resolved', icon: <CheckCircleIcon />, value: resolvedReports, label: 'Resolved Reports', iconColor: '#2e7d32' }
    ];

    const countReportByStatus = (status) =>
    {
        let count = 0;

        for(let i = 0; i < citizenReports.length; i++)
        {
            if(citizenReports[i].status === status)
            {
                count = count + 1;
            }            
        }

        return count;
    };

    const fetchCitizenReports = async() =>
    {
        const user = JSON.parse(localStorage.getItem('user'));
        const email = user.email;

        try
        {
            const fetchResponse = await reportService.getReportsByEmail(email);
            
            if(fetchResponse.success)
            {
                const fetchedCitizenReports = fetchResponse.data;

                setCitizenReports(fetchedCitizenReports);
                setTotalReports(citizenReports.length);

                const pendingCount = countReportByStatus('Pending');
                const inProgressCount = countReportByStatus('In-Progress');
                const resolvedCount = countReportByStatus('Resolved');
                
                setPendingReports(pendingCount);
                setInProgressReports(inProgressCount);
                setResolvedReports(resolvedCount);
            }; 
        }
        catch(error)
        {
            console.error(error);
        }
    };

    useEffect(() => 
    {
        if(totalReports === 0)
        {
            fetchCitizenReports();
        }
        
    }, [citizenReports]);

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