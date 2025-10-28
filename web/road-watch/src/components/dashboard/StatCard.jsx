import '../dashboard/styles/StatCard.css';

const StatCard = ({ icon, value, label, bgColor }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ backgroundColor: bgColor }}>
        {icon}
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
};

export default StatCard;
