import { useState } from 'react';
const ReportStatusChanger = ({ status, statusList, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [reason, setReason] = useState('');
  const handleSave = () => {
    if (selectedStatus === 'Rejected' && !reason.trim()) return;
    if (onUpdate) onUpdate(selectedStatus, reason);
    setReason('');
  };
  return (
    <div className="report-status-changer">
      <h4>Update Status</h4>
      <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
        {statusList.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {selectedStatus === 'Rejected' && (
        <input type="text" placeholder="Enter rejection comment..." value={reason} onChange={e => setReason(e.target.value)} required style={{ marginLeft: '1rem' }} />
      )}
      <button style={{ marginLeft: '1rem' }} onClick={handleSave} disabled={selectedStatus==='Rejected' && !reason.trim()}>Save Status</button>
    </div>
  );
};
export default ReportStatusChanger;
