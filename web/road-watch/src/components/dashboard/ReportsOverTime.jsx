import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '../dashboard/styles/ReportsOverTime.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportsOverTime = () => {
  // Static mock data - hardcoded for presentation
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Reports',
        data: [180, 160, 210, 175, 195, 140, 150],
        backgroundColor: '#00796b',
        borderRadius: 4,
        barThickness: 40
      },
      {
        label: 'Resolved',
        data: [120, 130, 145, 155, 165, 110, 125],
        backgroundColor: '#80cbc4',
        borderRadius: 4,
        barThickness: 40
      }
    ]
  };

  // Chart configuration options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Hide default legend
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
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#666666',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      y: {
        grid: {
          color: '#e0e0e0',
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#666666',
          font: {
            size: 12,
            weight: '500'
          },
          padding: 8,
          stepSize: 50
        }
      }
    }
  };

  return (
    <div className="reports-over-time">
      <h3 className="chart-title">Reports Over Time</h3>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#00796b' }}></span>
          <span className="legend-label">Reports</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#80cbc4' }}></span>
          <span className="legend-label">Resolved</span>
        </div>
      </div>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ReportsOverTime;
