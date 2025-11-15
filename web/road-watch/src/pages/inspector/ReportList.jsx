import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportFilterPanel from '../../components/reports/ReportFilterPanel';
const mockReports = [
  { id: 'r1', title: 'Pothole on 5th St', category: 'Pothole', status: 'In Progress', date: '2024-03-18', location: '5th St', reporter: 'Jane Doe' },
  { id: 'r2', title: 'Flooded crosswalk', category: 'Flooding', status: 'Pending', date: '2024-03-17', location: 'Crosswalk Ave', reporter: 'Ben Smith' }
];
const ReportList = ({ assignedOnly }) => {
  const [reports] = useState(mockReports); // Normally filter for assigned only
  const [filtered, setFiltered] = useState(mockReports);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const handleFilter = f => {
    setFiltered(reports.filter(r => {
      return (!f.status || r.status === f.status) &&
             (!f.category || r.category === f.category) &&
             (!f.location || r.location.toLowerCase().includes(f.location.toLowerCase())) &&
             (!f.reporter || r.reporter.toLowerCase().includes(f.reporter.toLowerCase())) &&
             (!f.from || r.date >= f.from) &&
             (!f.to || r.date <= f.to);
    }));
    setPage(1);
  };
  const startIdx = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);
  const pageCount = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div style={{maxWidth:1050,margin:'38px auto',padding:'12px'}}>
      <div style={{background:'#fff',borderRadius:14,boxShadow:'0 2px 16px #e6f0ee',padding:'30px 30px',marginBottom:30}}>
        <h2 style={{fontWeight:700,fontSize:26,color:'#219487',margin:'0 0 24px'}}> {assignedOnly ? 'Assigned Reports' : 'All Reports'} </h2>
        <ReportFilterPanel onFilterChange={handleFilter} />
        <div style={{overflowX:'auto',marginTop:18}}>
          <table style={{width:'100%',borderSpacing:0,fontSize:15}}>
            <thead>
              <tr style={{background:'#eef7f4',height:42}}>
                <th style={{fontWeight:600, textAlign:'left', padding:'8px 15px'}}>Title</th>
                <th style={{fontWeight:600, textAlign:'center'}}>Status</th>
                <th style={{fontWeight:600, textAlign:'center'}}>Category</th>
                <th style={{fontWeight:600, textAlign:'center'}}>Date</th>
                <th style={{fontWeight:600, textAlign:'center'}}>Location</th>
                <th style={{fontWeight:600, textAlign:'center'}}>Reporter</th>
                <th style={{fontWeight:600, textAlign:'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (<tr><td colSpan={7} style={{textAlign:'center',padding:'2em'}}>No reports found</td></tr>)}
              {paginated.map(r => (
                <tr key={r.id}
                  style={{borderBottom:'1px solid #f4f4ed',transition:'background 0.13s'}}
                  onMouseOver={e=>e.currentTarget.style.background='#e8f5f2'}
                  onMouseOut={e=>e.currentTarget.style.background=''}
                >
                  <td style={{padding:'10px 14px'}}>
                    <button onClick={()=>navigate(`/inspector/reports/${r.id}`)} style={{background:'none',color:'#2374dc',fontWeight:700,border:'none',cursor:'pointer',textDecoration:'underline',fontSize:15}}>{r.title}</button>
                  </td>
                  <td style={{textAlign:'center'}}><span style={{background:r.status==='Rejected'?'#f0493e':r.status==='Pending'?'#ffa600':r.status==='In Progress'?'#3196fa':'#25e35c', color:'#fff',padding:'2.5px 13px',borderRadius:9, fontSize:14, fontWeight:600, boxShadow:'0 1px 7px #ededf9'}}>{r.status}</span></td>
                  <td style={{textAlign:'center'}}>{r.category}</td>
                  <td style={{textAlign:'center'}}>{r.date}</td>
                  <td style={{textAlign:'center'}}>{r.location}</td>
                  <td style={{textAlign:'center'}}>{r.reporter}</td>
                  <td style={{textAlign:'center'}}><button style={{background:'#06a082',color:'#fff',border:'none',borderRadius:7,padding:'6px 15px',fontWeight:600,fontSize:15,cursor:'pointer'}} onClick={()=>navigate(`/inspector/reports/${r.id}`)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{marginTop:16, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:15}}>
          <span>Showing <b>{Math.min(startIdx+1,filtered.length)}</b> - <b>{Math.min(startIdx+itemsPerPage,filtered.length)}</b> of <b>{filtered.length}</b></span>
          <div style={{display:'flex',gap:6}}>
            <button 
              style={{background:'#1aac9b',color:'#fff',border:'none',borderRadius:6,padding:'7px 13px',fontWeight:600,cursor:'pointer',opacity:page===1?0.5:1}} 
              disabled={page===1} 
              onClick={()=>setPage(page-1)}>Prev</button>
            <span style={{padding:'0 10px'}}>{page} / {pageCount||1}</span>
            <button 
              style={{background:'#1aac9b',color:'#fff',border:'none',borderRadius:6,padding:'7px 13px',fontWeight:600,cursor:'pointer',opacity:page===pageCount||pageCount===0?0.5:1}} 
              disabled={page===pageCount||pageCount===0} 
              onClick={()=>setPage(page+1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReportList;
