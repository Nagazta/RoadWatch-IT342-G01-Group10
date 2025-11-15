import { useState } from 'react';

const mockReports = [
  { id: 'r1', image: 'Road', title: 'Large Pothole on Main Street', category: 'Pothole', address: 'Looc, San Remigio, Cebu', status: 'Pending', date: '2025-10-10', reporter: 'John Smith', distance: 0.3 },
  { id: 'r2', image: 'Crack', title: 'Sidewalk Crack Near School', category: 'Sidewalk Damage', address: '567 Oak Avenue, School District', status: 'In Progress', date: '2024-04-14', reporter: 'Sarah Johnson', distance: 1.2 },
  { id: 'r3', image: 'Sign', title: 'Damaged Street Sign', category: 'Signage', address: '890 Pine Road, Residential', status: 'Completed', date: '2024-04-13', reporter: 'Mike Davis', distance: 2.1 },
  { id: 'r4', image: 'Light', title: 'Broken Street Light', category: 'Lighting', address: '345 Elm Street, Commercial', status: 'Pending', date: '2024-04-12', reporter: 'Lisa Wilson', distance: 0.8 },
  { id: 'r5', image: 'Road', title: 'Road Surface Deterioration', category: 'Road Surface', address: '678 Maple Drive, Suburban', status: 'Rejected', date: '2024-04-11', reporter: 'Tom Brown', distance: 3.5 },
  { id: 'r6', image: 'Drain', title: 'Blocked Storm Drain', category: 'Drainage', address: '123 Cedar Lane, Industrial', status: 'Pending', date: '2024-04-10', reporter: 'Emma Garcia', distance: 1.7 },
  { id: 'r7', image: 'Hole', title: 'Deep Pothole Emergency', category: 'Pothole', address: '456 Birch Street, Residential', status: 'In Progress', date: '2024-04-09', reporter: 'David Lee', distance: 0.5 },
  { id: 'r8', image: 'Curb', title: 'Damaged Curb Section', category: 'Curb Damage', address: '789 Spruce Avenue, Downtown', status: 'Completed', date: '2024-04-08', reporter: 'Rachel Martinez', distance: 2.3 },
];

const statusStyles = {
  Pending:   { background: '#ffa600', color:'#fff' },
  'In Progress': { background: '#3196fa', color:'#fff' },
  Completed: { background: '#25e35c', color:'#fff' },
  Rejected:  { background: '#f0493e', color:'#fff' },
};
const sortOptions = [
  { label: 'Date', value: 'date' },
  { label: 'Status', value: 'status' },
  { label: 'Distance', value: 'distance' },
];
const itemsPerPageOptions = [4, 8, 12];

const InspectorDashboard = () => {
  const [sortBy, setSortBy] = useState('date');
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [page, setPage] = useState(1);
  // Table logic
  let filtered = mockReports;
  filtered = filtered.sort((a, b) => {
    if (sortBy === 'distance') return a.distance - b.distance;
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return b.date.localeCompare(a.date);
  });
  const totalReports = filtered.length;
  const startIdx = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);
  const pageCount = Math.ceil(totalReports / itemsPerPage);
  return (
    <div style={{ padding: '32px 24px 0 270px', background: '#f6fafb', minHeight: '100vh', fontFamily:'Segoe UI, sans-serif' }}>
      <div style={{maxWidth: '1050px', margin:'0 auto'}}>
        <div style={{background:'#fff',borderRadius:14,boxShadow:'0 2px 16px #e6f0ee',padding:'32px 30px 24px 30px',marginBottom:30}}>
          {/* <h2 style={{fontWeight:700, color:'#24796b', marginBottom:12, fontSize:'2rem', letterSpacing:'.2px'}}>Inspector Dashboard</h2> */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8,marginBottom:14}}>
            <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
              <label style={{fontWeight:500,fontSize:16}}>Sort by:
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{marginLeft:7, padding:'7px 12px', borderRadius:7, border:'1.3px solid #aad2ca',fontSize:15,background:'#f7fbfa'}}>{sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
              </label>
              <label style={{fontWeight:500,fontSize:16}}>Items per page:
                <select value={itemsPerPage} onChange={e=>{setItemsPerPage(Number(e.target.value));setPage(1);}} style={{marginLeft:7,padding:'7px 12px',borderRadius:7,border:'1.3px solid #aad2ca',fontSize:15,background:'#f7fbfa'}}>{itemsPerPageOptions.map(n=>(<option key={n} value={n}>{n}</option>))}</select>
              </label>
            </div>
            <div style={{fontWeight:500, color:'#399cbb', fontSize:15}}>Total Reports: <span style={{fontWeight:700,fontSize:16, color:'#16846d'}}>{totalReports}</span></div>
          </div>
          <div style={{overflowX:'auto',marginTop:2}}>
            <table style={{width:'100%',minWidth:950,borderSpacing:0,fontSize:16}}>
              <thead>
                <tr style={{background:'#eaf4ee',height:44}}>
                  <th style={{fontWeight:700, textAlign:'left', padding:'11px 14px',color:'#285b60'}}>Image</th>
                  <th style={{fontWeight:700, textAlign:'left', padding:'11px 14px',color:'#285b60'}}>Title & Category</th>
                  <th style={{fontWeight:700, textAlign:'left', padding:'11px 14px',color:'#285b60'}}>Address</th>
                  <th style={{fontWeight:700, textAlign:'center', padding:'11px 12px',color:'#285b60'}}>Status</th>
                  <th style={{fontWeight:700, textAlign:'center', padding:'11px 12px',color:'#285b60'}}>Date</th>
                  <th style={{fontWeight:700, textAlign:'center', padding:'11px 12px',color:'#285b60'}}>Reporter</th>
                  <th style={{fontWeight:700, textAlign:'right', padding:'11px 12px',color:'#285b60'}}>Distance</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 && (
                  <tr><td colSpan={7} style={{textAlign:'center',padding:'2em'}}>No reports found</td></tr>
                )}
                {paginated.map((r) => (
                  <tr key={r.id}
                    style={{borderBottom:'1px solid #f0f3f5',transition:'background 0.15s'}}
                    onMouseOver={e=>e.currentTarget.style.background='#eafbf4'}
                    onMouseOut={e=>e.currentTarget.style.background='' }
                  >
                    <td style={{padding:'11px 14px'}}>
                      <div style={{background:'#e1efd7',borderRadius:7,padding:'6px 13px',minWidth:46,textAlign:'center',fontWeight:'bold',color:'#467d31',fontSize:16}}>{r.image}</div>
                    </td>
                    <td style={{padding:'11px 14px'}}>
                      <button style={{background:'none',color:'#2374dc',fontWeight:700,fontSize:15,border:'none',cursor:'pointer',padding:0,textDecoration:'underline'}}>{r.title}</button>
                      <div style={{fontSize:13, color:'#3f6277',fontWeight:500}}>{r.category}</div>
                    </td>
                    <td style={{padding:'11px 14px'}}>{r.address}</td>
                    <td style={{padding:'11px 12px',textAlign:'center'}}>
                      <span style={{...statusStyles[r.status],padding:'4.5px 15px',borderRadius:12, fontSize:14, fontWeight:600,boxShadow:'0 1px 8px #ededf9'}}>{r.status}</span>
                    </td>
                    <td style={{padding:'11px 12px',textAlign:'center'}}>{r.date}</td>
                    <td style={{padding:'11px 12px',textAlign:'center',fontWeight:600}}>{r.reporter}</td>
                    <td style={{padding:'11px 12px',textAlign:'right',fontWeight:700,color:'#23b137',fontSize:16}}>{r.distance.toFixed(1)} <span style={{fontWeight:400,fontSize:15}}>km</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{marginTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:15}}>
            <span>Showing <b>{Math.min(startIdx+1,totalReports)}</b> - <b>{Math.min(startIdx+itemsPerPage,totalReports)}</b> of <b>{totalReports}</b></span>
            <div style={{display:'flex',gap:8}}>
              <button 
                style={{background:'#1aac9b',color:'#fff',border:'none',borderRadius:7,padding:'7px 18px',fontWeight:600,fontSize:14,cursor:'pointer',opacity:page===1?0.5:1}} 
                disabled={page===1} 
                onClick={()=>setPage(page-1)}>Prev</button>
              <span style={{padding:'0 10px',fontWeight:600,fontSize:14}}>{page} / {pageCount||1}</span>
              <button 
                style={{background:'#1aac9b',color:'#fff',border:'none',borderRadius:7,padding:'7px 18px',fontWeight:600,fontSize:14,cursor:'pointer',opacity:page===pageCount||pageCount===0?0.5:1}} 
                disabled={page===pageCount||pageCount===0} 
                onClick={()=>setPage(page+1)}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorDashboard;
