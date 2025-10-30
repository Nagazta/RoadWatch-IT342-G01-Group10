import "../styles/InspectorTable.css"

export default function InspectorReportsTable({ reports }) {
  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase().replace(" ", "-")}`
  }

  const getImageBadgeStyle = (type) => {
    const typeColors = {
      Road: { bg: "#fff3cd", color: "#856404", text: "Road" },
      Crack: { bg: "#e7d4f5", color: "#5a3a7a", text: "Crack" },
      Sign: { bg: "#d4e7f5", color: "#3a5a7a", text: "Sign" },
      Light: { bg: "#fff9e6", color: "#8b7500", text: "Light" },
      Drain: { bg: "#d4f5e7", color: "#3a7a5a", text: "Drain" },
      Hole: { bg: "#f5e7d4", color: "#7a5a3a", text: "Hole" },
      Curb: { bg: "#f5d4d4", color: "#7a3a3a", text: "Curb" },
    }
    return typeColors[type] || { bg: "#f0f0f0", color: "#666", text: type }
  }

  return (
    <div className="table-wrapper">
      <table className="reports-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title & Category</th>
            <th>Address</th>
            <th>Status</th>
            <th>Date</th>
            <th>Reporter</th>
            <th>Distance</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => {
            const badgeStyle = getImageBadgeStyle(report.type)
            return (
              <tr key={report.id}>
                <td className="image-cell">
                  <div
                    className="image-badge"
                    style={{
                      backgroundColor: badgeStyle.bg,
                      color: badgeStyle.color,
                    }}
                  >
                    {report.type.substring(0, 3).toUpperCase()}
                  </div>
                </td>
                <td className="title-cell">
                  <div className="title-content">
                    <a href="#" className="title-link">
                      {report.title}
                    </a>
                    <div className="category">{report.category}</div>
                  </div>
                </td>
                <td>{report.address}</td>
                <td>
                  <span className={getStatusClass(report.status)}>{report.status}</span>
                </td>
                <td>{report.date}</td>
                <td>{report.reporter}</td>
                <td className="distance-cell">{report.distance}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
