import { useState } from 'react';
const ReportCommentThread = ({ comments = [], onAddComment }) => {
  const [comment, setComment] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (onAddComment) onAddComment(comment);
    setComment('');
  };
  return (
    <div className="report-comment-thread">
      <h4>Comments/Updates</h4>
      <ul>
        {comments.map((c, i) => (
          <li key={i}><b>{c.by} ({c.ts}):</b> {c.comment}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Add comment/update for citizen..." />
        <button type="submit" disabled={!comment.trim()}>Add Comment</button>
      </form>
    </div>
  );
};
export default ReportCommentThread;
