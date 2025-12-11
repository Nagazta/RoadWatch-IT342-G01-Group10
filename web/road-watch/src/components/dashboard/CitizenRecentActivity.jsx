import { useEffect, useState } from 'react';
import './styles/CitizenRecentActivity.css';
import { CircleFilledIcon } from '../common/Icons';

const CitizenRecentActivity = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentReportActivity();
    }, []);

    const fetchRecentReportActivity = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (!user) {
                setLoading(false);
                return;
            }

            const apiUrl = import.meta.env.VITE_API_BASE_URL;

            // Fetch user's reports
            const response = await fetch(
                `${apiUrl}/api/reports/getByEmail?email=${encodeURIComponent(user.email)}`
            );

            if (!response.ok) {
                console.warn('Could not fetch reports');
                setLoading(false);
                return;
            }

            const reports = await response.json();
            console.log('📋 Reports fetched:', reports);

            // Convert reports to activity format
            const reportActivities = reports
                .sort((a, b) => new Date(b.updatedAt || b.dateSubmitted) - new Date(a.updatedAt || a.dateSubmitted))
                .slice(0, 5) // Show last 5
                .map(report => {
                    const isResolved = report.status === 'Resolved';
                    const isInProgress = report.status === 'In-Progress' || report.status === 'In Progress';
                    const isPending = report.status === 'Pending';

                    return {
                        id: report.id,
                        title: isResolved ? 'Report Resolved' : 
                               isInProgress ? 'Status Update' : 
                               'New Report',
                        description: report.title || report.location || 'Road damage report',
                        updated: formatTimeAgo(report.updatedAt || report.dateSubmitted),
                        status: report.status,
                        color: isResolved ? '#2e7d32' : 
                               isInProgress ? '#1565c0' : 
                               '#f57f17'
                    };
                });

            setActivities(reportActivities);
            setLoading(false);
        } catch (err) {
            console.error('❌ Error fetching report activity:', err);
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateTimeStr) => {
        if (!dateTimeStr) return 'Recently';
        
        const date = new Date(dateTimeStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="citizen-recent-activity">
                <h3>Recent Activity</h3>
                <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    Loading activity...
                </p>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="citizen-recent-activity">
                <h3>Recent Activity</h3>
                <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    No reports yet. Submit your first report!
                </p>
            </div>
        );
    }

    return (
        <div className="citizen-recent-activity">
            <h3>Recent Activity</h3>

            <ul>
                {activities.map((activity) => (
                    <li key={activity.id}>
                        <h4>
                            <span 
                                className="circle-icon" 
                                style={{ color: activity.color }}
                            >
                                <CircleFilledIcon />
                            </span>
                            {activity.title}
                        </h4>
                        <p>{activity.description}</p>
                        <p className="time-ago">{activity.updated}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CitizenRecentActivity;