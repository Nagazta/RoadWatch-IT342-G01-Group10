import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import reportService from '../../services/api/reportService';
import '../admin/styles/Dashboard.css';
import './styles/InspectorStyles.css';

const STATUS_LIST = ['Pending', 'Under Review', 'Approved', 'In Progress', 'Resolved', 'Rejected'];

const badgeColors = {
  Pending: '#ffa600',
  'Under Review': '#6e84ed',
  Approved: '#23b137',
  'In Progress': '#3196fa',
  Resolved: '#25e35c',
  Rejected: '#f0493e',
};

const ReportDetail = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [audit, setAudit] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchReportDetail = async () => {
      setLoading(true);
      setError('');
      const res = await reportService.getReportDetail(reportId);
      setLoading(false);
      if (res.success) {
        setReport(res.data);
        setStatus(res.data.status || 'Pending');
        setNewStatus(res.data.status || 'Pending');
        setAudit(res.data.audit || []);
        
        // Parse adminNotes into comments array
        const parsedComments = parseAdminNotes(res.data.adminNotes);
        setComments(res.data.comments || parsedComments);
      } else {
        setError(res.error || 'Failed to fetch report details');
      }
    };
    fetchReportDetail();
  }, [reportId]);

  // Helper function to parse adminNotes into comments array
  const parseAdminNotes = (adminNotes) => {
    if (!adminNotes || adminNotes.trim() === '') {
      return [];
    }

    // Split by the separator "---"
    const entries = adminNotes.split('\n---\n');
    return entries.map((entry) => {
      // Extract timestamp and comment from format: [YYYY-MM-DD HH:MM:SS] comment text
      const match = entry.match(/^\[(.*?)\]\s(.*)$/s);
      if (match) {
        const [, timestamp, comment] = match;
        return {
          by: 'Inspector',
          comment: comment.trim(),
          ts: timestamp.replace('T', ' '),
        };
      }
      return {
        by: 'Inspector',
        comment: entry.trim(),
        ts: 'Unknown',
      };
    });
  };

  const handleStatusChange = async () => {
    if (newStatus === 'Rejected' && rejectionReason.trim() === '') return;
    
    setLoading(true);
    setError('');
    
    // Update status on backend
    const statusRes = await reportService.updateReportStatus(reportId, newStatus);
    
    if (!statusRes.success) {
      setError(statusRes.error || 'Failed to update status');
      setLoading(false);
      return;
    }

    // Update report with latest data
    setReport(statusRes.data);
    setStatus(newStatus);

    // If rejected, add rejection reason as comment
    if (newStatus === 'Rejected') {
      const commentRes = await reportService.addCommentToReport(reportId, `Rejection Reason: ${rejectionReason}`);
      if (!commentRes.success) {
        setError(commentRes.error || 'Failed to add rejection reason');
        setLoading(false);
        return;
      }
      // Update report and comments with the latest data
      setReport(commentRes.data);
      const updatedComments = parseAdminNotes(commentRes.data.adminNotes);
      setComments(updatedComments);
    }

    // Update audit history
    setAudit([
      ...audit,
      {
        ts: new Date().toISOString().slice(0, 16).replace('T', ' '),
        event: `Status changed to ${newStatus}${
          newStatus === 'Rejected' ? ` (Reason: ${rejectionReason})` : ''
        }`,
        by: 'Inspector',
      },
    ]);
    setRejectionReason('');
    setSuccess('Status updated!');
    setLoading(false);
    setTimeout(() => setSuccess(''), 1500);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setLoading(true);
    setError('');
    
    // Add comment on backend
    const commentRes = await reportService.addCommentToReport(reportId, newComment);
    
    if (!commentRes.success) {
      setError(commentRes.error || 'Failed to add comment');
      setLoading(false);
      return;
    }

    // Update report with latest data from backend
    setReport(commentRes.data);
    
    // Parse updated adminNotes into comments
    const updatedComments = parseAdminNotes(commentRes.data.adminNotes);
    setComments(updatedComments);
    
    setAudit([
      ...audit,
      {
        ts: new Date().toISOString().slice(0, 16).replace('T', ' '),
        event: 'Comment added',
        by: 'Inspector',
      },
    ]);
    setNewComment('');
    setSuccess('Comment added!');
    setLoading(false);
    setTimeout(() => setSuccess(''), 1200);
  };

  if (loading) {
    return (
      <div className="dashboard-container inspector-page">
        <div className="inspector-section">
          <p>Loading report details...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="dashboard-container inspector-page">
        <div className="inspector-section">
          <p style={{ color: 'red' }}>{error || 'Report not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container inspector-page">
      <div className="inspector-section">
        <h1 className="inspector-card-title">Report Details</h1>
        <div className="inspector-detail-grid">
          <div className="inspector-detail-title">{report.title}</div>
          <div>
            <b>Category:</b> <span className="inspector-highlight">{report.category}</span>
          </div>
          <div>
            <b>Location:</b> {report.location}
          </div>
          <div>
            <b>Status:</b>{' '}
            <span className="inspector-status-pill" style={{ background: badgeColors[status] || '#aaa' }}>
              {status}
            </span>
          </div>
          <div>
            <b>Date Reported:</b> {report.dateSubmitted ? new Date(report.dateSubmitted).toLocaleDateString() : 'N/A'}
          </div>
          <div>
            <b>Reporter:</b> {report.submittedBy}
          </div>
          <div>
            <b>Description:</b>
            <br />
            <span className="inspector-subtext">{report.description}</span>
          </div>
        </div>

        <h3 className="inspector-section-title">Location Map</h3>
        <div className="inspector-map-container">
          {report.latitude && report.longitude ? (
            <iframe
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${report.latitude},${report.longitude}&hl=en&z=15&output=embed`}
              title="Report Location Map"
            />
          ) : (
            <p className="inspector-subtext">Location coordinates not available</p>
          )}
        </div>

        <h3 className="inspector-section-title">Update Status</h3>
        <div className="inspector-actions">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="inspector-select-input"
          >
            {STATUS_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {newStatus === 'Rejected' && (
            <input
              type="text"
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="inspector-text-input"
            />
          )}
          <button
            type="button"
            className="inspector-btn-primary"
            disabled={newStatus === 'Rejected' && !rejectionReason.trim()}
            onClick={handleStatusChange}
          >
            Save Status
          </button>
        </div>

        {success && <div className="inspector-alert inspector-alert--success">{success}</div>}

        <h3 className="inspector-section-title">Comments &amp; Updates</h3>
        <div>
          <ul className="inspector-comment-list">
            {comments.map((c, i) => (
              <li key={`${c.by}-${i}`} className="inspector-comment">
                <b>{c.by}</b> <span className="inspector-subtext">{c.ts}</span>
                <br />
                {c.comment}
              </li>
            ))}
          </ul>
          <div className="inspector-actions" style={{ marginTop: 16 }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add comment/update for citizen..."
              className="inspector-textarea"
            />
            <button
              type="button"
              className="inspector-btn-primary"
              disabled={!newComment.trim()}
              onClick={handleAddComment}
            >
              Send
            </button>
          </div>
        </div>

        <h3 className="inspector-section-title">Audit History</h3>
        <ul className="inspector-audit-timeline">
          {audit.map((a, i) => (
            <li key={`${a.ts}-${i}`}>
              <span className="inspector-highlight">{a.ts}:</span> {a.event}{' '}
              <span className="inspector-subtext">
                <i>({a.by})</i>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReportDetail;
