const ReportAuditTimeline = ({ audit = [] }) => (
  <div className="report-audit-timeline">
    <h4>Audit History</h4>
    <ul>
      {audit.map((a, idx) => (
        <li key={idx}><b>{a.ts}:</b> {a.event} <i>({a.by})</i></li>
      ))}
    </ul>
  </div>
);
export default ReportAuditTimeline;
