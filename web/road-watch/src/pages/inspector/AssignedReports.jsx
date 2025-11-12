import { useState } from 'react';
import ReportDetail from './ReportDetail';

const mockReports = [
  { id: 'r1', title: 'Pothole on 5th St', category: 'Pothole', status: 'In Progress', date: '2024-03-18', location: '5th St', reporter: 'Jane Doe' },
  { id: 'r2', title: 'Flooded crosswalk', category: 'Flooding', status: 'Pending', date: '2024-03-17', location: 'Crosswalk Ave', reporter: 'Ben Smith' }
];

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.22)',zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:12,padding:'22px 22px 8px 22px',maxWidth:650,width:'95%',boxShadow:'0 4px 32px #0001',position:'relative'}}>
        <button style={{position:'absolute',top:7,right:11,fontSize:29,color:'#338678',background:'none',border:'none',fontWeight:700,cursor:'pointer'}} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

const AssignedReports = () => {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{maxWidth:1050,margin:'38px auto',padding:'12px'}}>
      <div style={{background:'#fff',borderRadius:14,boxShadow:'0 2px 16px #e6f0ee',padding:'30px 30px',marginBottom:30}}>
        <h2 style={{fontWeight:700,fontSize:26,color:'#219487',margin:'0 0 24px'}}>Assigned Reports</h2>
        <div style={{overflowX:'auto',marginTop:8}}>
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
              {mockReports.length === 0 && (<tr><td colSpan={7} style={{textAlign:'center',padding:'2em'}}>No reports assigned</td></tr>)}
              {mockReports.map(r => (
                <tr key={r.id}
                  style={{borderBottom:'1px solid #f4f4ed',transition:'background 0.13s'}}
                  onMouseOver={e=>e.currentTarget.style.background='#e8f5f2'}
                  onMouseOut={e=>e.currentTarget.style.background=''}
                >
                  <td style={{padding:'10px 14px'}}>
                    <button onClick={()=>setSelected(r)} style={{background:'none',color:'#2374dc',fontWeight:700,border:'none',cursor:'pointer',textDecoration:'underline',fontSize:15}}>{r.title}</button>
                  </td>
                  <td style={{textAlign:'center'}}><span style={{background:r.status==='Rejected'?'#f0493e':r.status==='Pending'?'#ffa600':r.status==='In Progress'?'#3196fa':'#25e35c', color:'#fff',padding:'2.5px 13px',borderRadius:9, fontSize:14, fontWeight:600, boxShadow:'0 1px 7px #ededf9'}}>{r.status}</span></td>
                  <td style={{textAlign:'center'}}>{r.category}</td>
                  <td style={{textAlign:'center'}}>{r.date}</td>
                  <td style={{textAlign:'center'}}>{r.location}</td>
                  <td style={{textAlign:'center'}}>{r.reporter}</td>
                  <td style={{textAlign:'center'}}><button style={{background:'#06a082',color:'#fff',border:'none',borderRadius:7,padding:'6px 15px',fontWeight:600,fontSize:15,cursor:'pointer'}} onClick={()=>setSelected(r)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={!!selected} onClose={()=>setSelected(null)}>
        {/* For demo, just use mock data in ReportDetail. To use selected's data, pass as prop to ReportDetail. */}
        <ReportDetail />
      </Modal>
    </div>
  );
}
export default AssignedReports;
