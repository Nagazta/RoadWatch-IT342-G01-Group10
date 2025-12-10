import { useState } from 'react';
const categories = ['Pothole', 'Crack', 'Debris', 'Flooding', 'Other'];
const statusList = ['Pending','Under Review','Approved','In-Progress','Resolved','Rejected'];
const ReportFilterPanel = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({ status: '', category: '', from: '', to: '', location: '', reporter: '', title:'' });
  const update = (field, value) => {
    const upd = { ...filters, [field]: value };
    setFilters(upd);
    if (onFilterChange) onFilterChange(upd);
  };
  const clear = () => {
    const cl = { status:'', category:'', from:'',to:'',location:'', reporter:'', title:'' };
    setFilters(cl); if (onFilterChange) onFilterChange(cl);
  };
  return (
    <div style={{background:'#fff',borderRadius:13,boxShadow:'0 2px 14px #cce6e81b',padding:'28px 32px',margin:'0 0 26px 0'}}>
      <h2 style={{fontWeight:700,fontSize:26,color:'#219487',margin:'0 0 24px'}}>Provide details of the report:</h2>
      <form
        style={{
          display:'grid',
          gridTemplateColumns:'1fr 1fr',
          gap:'25px 38px',
          marginBottom:12,
          maxWidth:980,
          alignItems:'end',
        }}>
        {/* Left column */}
        <div style={{display:'flex',flexDirection:'column',gap:19}}>
          <div>
            <label style={{fontWeight:600, fontSize:15,marginBottom:6,display:'block'}}>Report Name/Title:</label>
            <input style={{width:'100%',padding:'13px',borderRadius:7, border:'1.5px solid #d7efe2', fontSize:16,marginTop:4,background:'#fafdff',outline:'none'}} type="text" value={filters.title} onChange={e => update('title', e.target.value)} placeholder="Enter report title or keywords..." />
          </div>
          <div>
            <label style={{fontWeight:600, fontSize:15,display:'block'}}>Status:</label>
            <select style={{width:'100%',padding:'13px',borderRadius:7,border:'1.5px solid #d7efe2',background:'#fafdff',fontSize:16,marginTop:4}} value={filters.status} onChange={e => update('status', e.target.value)}>
              <option value="">All Statuses</option>
              {statusList.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontWeight:600, fontSize:15,display:'block'}}>Date Reported:</label>
            <input style={{width:'100%',padding:'13px',borderRadius:7,border:'1.5px solid #d7efe2',background:'#fafdff',fontSize:16,marginTop:4}} type="date" value={filters.from} onChange={e => update('from', e.target.value)} />
          </div>
        </div>
        {/* Right column */}
        <div style={{display:'flex',flexDirection:'column',gap:19}}>
          <div>
            <label style={{fontWeight:600, fontSize:15,display:'block'}}>Category:</label>
            <select style={{width:'100%',padding:'13px',borderRadius:7,border:'1.5px solid #d7efe2',background:'#fafdff',fontSize:16,marginTop:4}} value={filters.category} onChange={e => update('category', e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontWeight:600, fontSize:15,display:'block'}}>Address/Location:</label>
            <input style={{width:'100%',padding:'13px',borderRadius:7, border:'1.5px solid #d7efe2',fontSize:16,background:'#fafdff',marginTop:4}} value={filters.location} onChange={e => update('location', e.target.value)} placeholder="Enter street, area, or landmark..." />
          </div>
          <div>
            <label style={{fontWeight:600, fontSize:15,display:'block'}}>Reported By (Citizen):</label>
            <input style={{width:'100%',padding:'13px',borderRadius:7, border:'1.5px solid #d7efe2',fontSize:16,background:'#fafdff',marginTop:4}} value={filters.reporter} onChange={e => update('reporter', e.target.value)} placeholder="Enter citizen name..." />
          </div>
        </div>
      </form>
      <div style={{display:'flex',gap:12,marginTop:12}}>
        <button type="button" onClick={()=>{if (onFilterChange) onFilterChange(filters);}} style={{background:'#12685f',color:'#fff',padding:'13px 34px',border:'none',fontWeight:700,borderRadius:8,fontSize:18,boxShadow:'0 1px 6px #d5eae0',cursor:'pointer'}}>Search</button>
        <button type="button" onClick={clear} style={{background:'#e9eedc',color:'#338678',padding:'13px 28px',border:'none',fontWeight:700,borderRadius:8,fontSize:18,boxShadow:'0 1px 4px #e7f7e5',cursor:'pointer'}}>Clear All</button>
      </div>
    </div>
  );
};
export default ReportFilterPanel;
