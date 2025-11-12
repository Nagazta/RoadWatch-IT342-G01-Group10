import { useState } from 'react';
const categories = ['Pothole','Crack','Debris','Flooding','Other'];
const MAX_PHOTOS = 5, MAX_SIZE_MB = 5;
const CreateReport = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const handlePhotoChange = e => {
    const files = Array.from(e.target.files);
    if (files.length + photos.length > MAX_PHOTOS) {
      setError(`You can upload up to ${MAX_PHOTOS} photos.`);
      return;
    }
    for (let f of files) {
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Each photo must be under ${MAX_SIZE_MB}MB.`);
        return;
      }
    }
    setPhotos([...photos, ...files]);
    setError('');
  };
  const handleRemovePhoto = idx => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };
  const handleSubmit = e => {
    e.preventDefault();
    setSuccess('');
    if (!title || !category || !location) {
      setError('Please fill all required fields.');
      return;
    }
    if (photos.length === 0) {
      setError('Please upload at least 1 photo.');
      return;
    }
    setError('');
    setSuccess('Report created successfully (demo only)!');
    setTitle(''); setDescription(''); setCategory(''); setLocation(''); setPhotos([]);
  };
  return (
    <div style={{maxWidth:520,margin:'38px auto',padding:'14px'}}>
      <div style={{background:'#fff',borderRadius:14,boxShadow:'0 3px 16px #cfe3d94a',padding:'36px 34px',marginBottom:22}}>
        <h2 style={{fontWeight:700,fontSize:26,color:'#219487',margin:'0 0 20px'}}>Create New Report</h2>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:20}}>
            <label style={{fontWeight:600,display:'block',marginBottom:7}}>Title<span style={{color:'#ba1919'}}>*</span></label>
            <input style={{width:'100%',padding:'11px',fontSize:16,borderRadius:7,border:'1.5px solid #b9ebe0',outline:'none',boxSizing:'border-box'}}
              value={title} onChange={e=>setTitle(e.target.value)} placeholder="Short descriptive title" required />
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontWeight:600,display:'block',marginBottom:7}}>Description</label>
            <textarea style={{width:'100%',padding:'11px',fontSize:16,borderRadius:7,border:'1.5px solid #b9ebe0',outline:'none',minHeight:80,resize:'vertical',boxSizing:'border-box'}}
              value={description} onChange={e=>setDescription(e.target.value)} placeholder="Add any details (optional)" />
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontWeight:600,display:'block',marginBottom:7}}>Category<span style={{color:'#ba1919'}}>*</span></label>
            <select style={{width:'100%',padding:'11px',fontSize:16,borderRadius:7,border:'1.5px solid #b9ebe0',outline:'none',background:'#f3fbf9'}} value={category} onChange={e=>setCategory(e.target.value)} required>
              <option value="">Select Category</option>
              {categories.map(c=>(<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontWeight:600,display:'block',marginBottom:7}}>Location<span style={{color:'#ba1919'}}>*</span></label>
            <input style={{width:'100%',padding:'11px',fontSize:16,borderRadius:7,border:'1.5px solid #b9ebe0',outline:'none',boxSizing:'border-box'}}
              value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g. 123 Main St, Barangay" required />
          </div>
          <hr style={{border:'none',borderTop:'1.5px solid #f1efef',margin:'32px 0 20px'}} />
          <div style={{marginBottom:10}}>
            <label style={{fontWeight:600,display:'block',marginBottom:12}}>Photos<span style={{color:'#ba1919'}}>*</span> <span style={{fontWeight:400, fontSize:13, color:'#5b7c6b'}}>(1–5 images, max 5MB each)</span></label>
            <input type="file" multiple accept="image/*" onChange={handlePhotoChange} style={{fontSize:15}} />
            {photos.length > 0 && <div style={{display:'flex',flexWrap:'wrap',gap:'10px',marginTop:13}}>{photos.map((p,i)=>(<div key={i} style={{position:'relative'}}>
              <img alt="preview" src={URL.createObjectURL(p)} style={{width:65,height:65,objectFit:'cover',borderRadius:8,border:'1px solid #aad2ca'}} />
              <button type="button" aria-label="Remove Photo" onClick={()=>handleRemovePhoto(i)} style={{position:'absolute',top:-7,right:-7,background:'#db5757',border:'none',borderRadius:'50%',width:22,height:22,color:'#fff',fontWeight:700,fontSize:15,cursor:'pointer',boxShadow:'0 2px 10px #ccc'}}>×</button>
            </div>))}</div>}
          </div>
          {error && <div style={{background:'#fff4f4',color:'#b31212',fontWeight:600,padding:'11px 18px',borderRadius:7,margin:'20px 0 4px',fontSize:15,border:'1px solid #ffecec'}}>{error}</div>}
          {success && <div style={{background:'#edfbf2',color:'#1a7e46',fontWeight:600,padding:'13px 18px',borderRadius:9,margin:'20px 0 14px',fontSize:15,border:'1.5px solid #c6eeda',boxShadow:'0 2px 12px #c2ebe11a'}}>{success}</div>}
          <button type="submit" style={{width:'100%',background:'#26bd5b',color:'#fff',border:'none',borderRadius:8,padding:'15px 0',fontWeight:700,fontSize:18,marginTop:14, boxShadow:'0 2px 10px #b9ebe08c', cursor:'pointer', transition: 'background .145s'}}
            onMouseOver={e => e.currentTarget.style.background='#179a3f'}
            onMouseOut={e => e.currentTarget.style.background='#26bd5b'}>
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateReport;
