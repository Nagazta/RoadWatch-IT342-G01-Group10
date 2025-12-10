import { useEffect, useState } from "react";
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
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ReportsOverTime = () => {
  const [weeklyReports, setWeeklyReports] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [weeklyResolved, setWeeklyResolved] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    fetch(`${API_URL}/api/reports/getAll`)
      .then(res => res.json())
      .then(reports => processWeeklyData(reports))
      .catch(err => console.error("Failed to fetch weekly report data:", err));
  }, []);

  const processWeeklyData = (reports) => {
    // 0–6 indexes represent Monday to Sunday
    const reportsCount = [0, 0, 0, 0, 0, 0, 0];
    const resolvedCount = [0, 0, 0, 0, 0, 0, 0];

    reports.forEach(report => {
      const date = new Date(report.dateSubmitted);
      let day = date.getDay(); // 0 = Sunday, 1 = Monday...

      // Convert Sunday(0) → index 6 to match your label order (Mon–Sun)
      day = day === 0 ? 6 : day - 1;

      reportsCount[day]++;

      if (report.status === "Resolved") {
        resolvedCount[day]++;
      }
    });

    setWeeklyReports(reportsCount);
    setWeeklyResolved(resolvedCount);
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Reports',
        data: weeklyReports,
        backgroundColor: '#00796b',
        borderRadius: 4,
        barThickness: 40
      },
      {
        label: 'Resolved',
        data: weeklyResolved,
        backgroundColor: '#80cbc4',
        borderRadius: 4,
        barThickness: 40
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
        borderRadius: 8
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#666',
          font: { size: 12, weight: 500 }
        }
      },
      y: {
        grid: { color: '#e0e0e0', drawBorder: false },
        ticks: {
          color: '#666',
          font: { size: 12, weight: 500 },
          stepSize: 5
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
