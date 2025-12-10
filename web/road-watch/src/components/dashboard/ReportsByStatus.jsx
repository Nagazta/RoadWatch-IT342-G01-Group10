import { useEffect, useState } from "react";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import '../dashboard/styles/ReportsByStatus.css';

ChartJS.register(ArcElement, Tooltip, Legend);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ReportsByStatus = () => {
  const [resolved, setResolved] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/reports/getAll`)
      .then(res => res.json())
      .then(reports => {
        setResolved(reports.filter(r => r.status === "Resolved").length);
        setInProgress(reports.filter(r => r.status === "In-Progress").length);
        setPending(reports.filter(r => r.status === "Pending").length);
      })
      .catch(err => console.error("Error fetching chart data:", err));
  }, []);

  const total = resolved + inProgress + pending;

  const chartData = {
    labels: ['Resolved', 'In-Progress', 'Pending'],
    datasets: [
      {
        data: [resolved, inProgress, pending],
        backgroundColor: ['#2e7d32', '#00695c', '#fbc02d'],
        borderWidth: 0,
        cutout: '70%'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        borderRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
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
          <span className="legend-text">Resolved ({resolved})</span>
        </div>

        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#00695c' }}></span>
          <span className="legend-text">In-Progress ({inProgress})</span>
        </div>

        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#fbc02d' }}></span>
          <span className="legend-text">Pending ({pending})</span>
        </div>
      </div>
    </div>
  );
};

export default ReportsByStatus;
