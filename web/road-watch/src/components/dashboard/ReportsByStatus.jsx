import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import '../dashboard/styles/ReportsByStatus.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const ReportsByStatus = () => {
  const chartData = {
    labels: ['Resolved', 'In Progress', 'Pending'],
    datasets: [
      {
        data: [1002, 156, 89],
        backgroundColor: ['#2e7d32', '#00695c', '#fbc02d'],
        borderWidth: 0,
        cutout: '70%'
      }
    ]
  };

  const total = 1247;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false 
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="reports-by-status">
      <h3 className="chart-title">Reports by Status</h3>
      <div className="chart-container">
        <div className="doughnut-wrapper">
          <Doughnut data={chartData} options={options} />
          <div className="doughnut-center">
            <div className="doughnut-total">{total}</div>
            <div className="doughnut-label">Total</div>
          </div>
        </div>
      </div>
      <div className="custom-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#2e7d32' }}></span>
          <span className="legend-text">Resolved ({chartData.datasets[0].data[0]})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#00695c' }}></span>
          <span className="legend-text">In Progress ({chartData.datasets[0].data[1]})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#fbc02d' }}></span>
          <span className="legend-text">Pending ({chartData.datasets[0].data[2]})</span>
        </div>
      </div>
    </div>
  );
};

export default ReportsByStatus;
