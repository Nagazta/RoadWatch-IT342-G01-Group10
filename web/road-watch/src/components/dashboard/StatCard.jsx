// src/components/common/StatCard.jsx
import React from 'react';
import '../dashboard/styles/StatCard.css';

const StatCard = ({ icon, value, label, iconColor, variant = 'horizontal' }) => {
  return (
    <div className={`common-stat-card ${variant}`}>
      {variant === 'horizontal' ? (
        <>
          <div className="common-stat-icon" style={{ color: iconColor }}>
            {icon}
          </div>
          <div className="common-stat-content">
            <h3 className="common-stat-value">{value}</h3>
            <p className="common-stat-label">{label}</p>
          </div>
        </>
      ) : (
        <>
          <div className="common-stat-icon" style={{ color: iconColor }}>
            {icon}
          </div>
          <h3 className="common-stat-value">{value}</h3>
          <p className="common-stat-label">{label}</p>
        </>
      )}
    </div>
  );
};

export default StatCard;