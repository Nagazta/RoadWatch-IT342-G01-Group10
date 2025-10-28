import React from 'react';
import StatCard from '../dashboard/StatCard';
import { MessageIcon, ClockIcon, CheckCircleIcon, TimerIcon } from '../common/Icons';

const FeedbackStats = ({ stats }) => {
  const statsData = [
    {
      id: 'total',
      icon: <MessageIcon />,
      value: stats.totalFeedback,
      label: 'Total Feedback',
      iconColor: '#00695c'
    },
    {
      id: 'pending',
      icon: <ClockIcon />,
      value: stats.pendingReview,
      label: 'Pending Review',
      iconColor: '#fbc02d'
    },
    {
      id: 'resolved',
      icon: <CheckCircleIcon />,
      value: stats.resolved,
      label: 'Resolved',
      iconColor: '#2e7d32'
    },
    {
      id: 'avg-time',
      icon: <TimerIcon />,
      value: stats.avgResponseTime,
      label: 'Average Response time',
      iconColor: '#1565c0'
    }
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
          variant="vertical"
        />
      ))}
    </div>
  );
};

export default FeedbackStats;