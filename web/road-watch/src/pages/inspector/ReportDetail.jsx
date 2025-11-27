import { useState } from 'react';
import '../admin/styles/Dashboard.css';
import './styles/InspectorStyles.css';

const mockReport = {
  id: 'RPT-001',
  title: 'Major pothole on 3rd Avenue',
  description: 'A large pothole has developed near the 3rd Ave crosswalk.',
  status: 'Under Review',
  category: 'Pothole',
  location: '3rd Ave',
  reporter: 'Jane Doe',
  dateReported: '2024-03-16',
  photos: [],
  audit: [
    { ts: '2024-03-16 09:31', event: 'Created', by: 'Citizen Jane Doe' },
    { ts: '2024-03-16 12:20', event: 'Status changed to Under Review', by: 'Inspector Sam Lee' },
  ],
  comments: [
    { by: 'Inspector Sam Lee', comment: 'Verified. Needs urgent fix.', ts: '2024-03-16 12:21' },
  ],
};

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
  const [status, setStatus] = useState(mockReport.status);
  const [audit, setAudit] = useState(mockReport.audit);
  const [comments, setComments] = useState(mockReport.comments);
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState(mockReport.status);
  const [rejectionReason, setRejectionReason] = useState('');
  const [success, setSuccess] = useState('');

  const handleStatusChange = () => {
    if (newStatus === 'Rejected' && rejectionReason.trim() === '') return;
    setStatus(newStatus);
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
    if (newStatus === 'Rejected') {
      setComments([
        ...comments,
        {
          by: 'Inspector',
          comment: rejectionReason,
          ts: new Date().toISOString().slice(0, 16).replace('T', ' '),
        },
      ]);
    }
    setRejectionReason('');
    setSuccess('Status updated!');
    setTimeout(() => setSuccess(''), 1500);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      { by: 'Inspector', comment: newComment, ts: new Date().toISOString().slice(0, 16).replace('T', ' ') },
    ]);
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
    setTimeout(() => setSuccess(''), 1200);
  };

  return (
    <div className="dashboard-container inspector-page">
      <div className="inspector-section inspector-section--compact">
        <h1 className="inspector-card-title">Report Details</h1>
        <div className="inspector-detail-grid">
          <div className="inspector-detail-title">{mockReport.title}</div>
          <div>
            <b>Category:</b> <span className="inspector-highlight">{mockReport.category}</span>
          </div>
          <div>
            <b>Location:</b> {mockReport.location}
          </div>
          <div>
            <b>Status:</b>{' '}
            <span className="inspector-status-pill" style={{ background: badgeColors[status] || '#aaa' }}>
              {status}
            </span>
          </div>
          <div>
            <b>Date Reported:</b> {mockReport.dateReported}
          </div>
          <div>
            <b>Reporter:</b> {mockReport.reporter}
          </div>
          <div>
            <b>Description:</b>
            <br />
            <span className="inspector-subtext">{mockReport.description}</span>
          </div>
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
