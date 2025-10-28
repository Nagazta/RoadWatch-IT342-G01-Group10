import '../dashboard/styles/StatCard.css';

const StatCard = ({ icon, value, label, bgColor }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ backgroundColor: bgColor }}>
        {icon}
      </div>
      <div className="stat-card-content">
        <h2 className="stat-card-value">{value}</h2>
        <p className="stat-card-label">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
