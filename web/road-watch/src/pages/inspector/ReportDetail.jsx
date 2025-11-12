import { useState } from 'react';

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
    { ts: '2024-03-16 12:20', event: 'Status changed to Under Review', by: 'Inspector Sam Lee' }
  ],
  comments: [
    { by: 'Inspector Sam Lee', comment: 'Verified. Needs urgent fix.', ts: '2024-03-16 12:21' }
  ]
};

const STATUS_LIST = ['Pending','Under Review','Approved','In Progress','Resolved','Rejected'];

const badgeColors = {
  Pending:   '#ffa600',
  'Under Review': '#6e84ed',
  Approved:  '#23b137',
  'In Progress': '#3196fa',
  Resolved:   '#25e35c',
  Rejected:  '#f0493e',
};

const sectionTitle = (text) => (
  <h3 style={{fontWeight:700, fontSize:22, marginTop:36, marginBottom:14, color:'#269b91'}}>{text}</h3>
);

const ReportDetail = () => {
  const [status, setStatus] = useState(mockReport.status);
  const [audit, setAudit] = useState(mockReport.audit);
  const [comments, setComments] = useState(mockReport.comments);
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState(mockReport.status);
  const [rejectionReason, setRejectionReason] = useState('');
  const [success, setSuccess] = useState('');

  const handleStatusChange = () => {
    if(newStatus === 'Rejected' && rejectionReason.trim() === '') return;
    setStatus(newStatus);
    setAudit([
      ...audit,
      {
        ts: new Date().toISOString().slice(0, 16).replace('T', ' '),
        event: `Status changed to ${newStatus}` + (newStatus === 'Rejected' ? ` (Reason: ${rejectionReason})` : ''),
        by: 'Inspector'
      }
    ]);
    if(newStatus === 'Rejected') {
      setComments([
        ...comments,
        { by: 'Inspector', comment: rejectionReason, ts: new Date().toISOString().slice(0, 16).replace('T', ' ') }
      ]);
    }
    setRejectionReason('');
    setSuccess('Status updated!');
    setTimeout(()=>setSuccess(''), 1500);
  };
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      { by: 'Inspector', comment: newComment, ts: new Date().toISOString().slice(0, 16).replace('T', ' ') }
    ]);
    setAudit([
      ...audit,
      {
        ts: new Date().toISOString().slice(0, 16).replace('T', ' '),
        event: 'Comment added',
        by: 'Inspector'
      }
    ]);
    setNewComment('');
    setSuccess('Comment added!');
    setTimeout(()=>setSuccess(''), 1200);
  };

  return (
    <div style={{maxWidth:640,margin:'34px auto',padding:'10px'}}>
      <div style={{background:'#fff',borderRadius:13,boxShadow:'0 3px 20px #d0e8f94d',padding:'32px 26px',marginBottom:18}}>
        <h1 style={{fontWeight:700, fontSize:28, color:'#269b91', marginBottom:10}}>Report Details</h1>
        <div style={{marginBottom:28, display:'grid', gap:'.6em'}}>
          <div style={{fontWeight:600, fontSize:20, color:'#155e74'}}>{mockReport.title}</div>
          <div><b>Category:</b> <span style={{color:'#009394',fontWeight:600}}>{mockReport.category}</span></div>
          <div><b>Location:</b> <span>{mockReport.location}</span></div>
          <div><b>Status:</b> <span style={{color:'#fff', background:badgeColors[status]||'#aaa', padding:'4px 17px', borderRadius:13, fontWeight:700}}>{status}</span></div>
          <div><b>Date Reported:</b> <span>{mockReport.dateReported}</span></div>
          <div><b>Reporter:</b> <span>{mockReport.reporter}</span></div>
          <div><b>Description:</b><br/><span style={{fontWeight:400, color:'#444'}}>{mockReport.description}</span></div>
        </div>
        {sectionTitle('Update Status')}
        <div style={{display:'flex',alignItems:'center', gap:12,marginBottom:12}}>
          <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={{fontSize:16,padding:'10px 16px',borderRadius:9,border:'1.6px solid #b9ebe0',outline:'none', minWidth:160, fontWeight:600, background:'#f8fcfb'}}>
            {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {newStatus === 'Rejected' && (
            <input type="text" placeholder="Enter rejection reason..." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} style={{padding:'10px 13px',borderRadius:9,border:'1.7px solid #fcc',width:260,fontSize:15,marginLeft:5}} required />
          )}
          <button onClick={handleStatusChange} disabled={newStatus==='Rejected' && !rejectionReason.trim()}
            style={{marginLeft:14, background:'#219487',color:'#fff',fontWeight:700,padding:'9px 22px',borderRadius:8,border:'none',fontSize:16,boxShadow:'0 2px 8px #b9ebe020',cursor:'pointer',opacity:(newStatus==='Rejected' && !rejectionReason.trim())?0.55:1}}>Save Status</button>
        </div>
        {success && <div style={{background:'#edfbf2',color:'#1a7e46',fontWeight:600,padding:'10px 16px',borderRadius:9,margin:'12px 0 10px',fontSize:15,border:'1.5px solid #c6eeda',boxShadow:'0 2px 12px #c2ebe11a'}}>{success}</div>}
        {sectionTitle('Comments & Updates')}
        <div style={{marginBottom:24}}>
          <ul style={{listStyle:'none',margin:0,padding:0,display:'flex',flexDirection:'column',gap:'15px'}}>
            {comments.map((c, i) => (
              <li key={i} style={{alignSelf:'flex-start',background:'#e4f1f6',padding:'10px 18px',borderRadius:10,maxWidth:'80%',boxShadow:'0 2px 10px #7fd3e31a'}}>
                <b style={{color:'#458fb1'}}>{c.by}</b> <span style={{fontSize:13,color:'#777'}}>{c.ts}</span><br/>{c.comment}
              </li>
            ))}
          </ul>
          <div style={{marginTop:18,display:'flex',gap:10}}>
            <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add comment/update for citizen..." style={{flex:1,minHeight:36,borderRadius:7,border:'1.4px solid #b3e0dc',padding:'8px 11px',fontSize:15,outline:'none',resize:'vertical'}} />
            <button onClick={handleAddComment} disabled={!newComment.trim()} style={{background:'#29b14d',color:'#fff',border:'none',borderRadius:8,padding:'0 19px',height:42,fontWeight:700,fontSize:17,cursor:'pointer',opacity:!newComment.trim()?0.5:1}}>Send</button>
          </div>
        </div>
        {sectionTitle('Audit History')}
        <div style={{borderLeft:'3.5px solid #a2ead9',marginLeft:5,paddingLeft:22}}>
          <ul style={{listStyle:'none',margin:0,padding:0,display:'flex',flexDirection:'column',gap:'10px'}}>
            {audit.map((a, i) => (
              <li key={i}>
                <span style={{fontWeight:600,color:'#4e8562'}}>{a.ts}:</span> {a.event} <span style={{color:'#579fe6'}}><i>({a.by})</i></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
