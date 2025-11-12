import { useState } from 'react';

function getInitials(name) {
  if (!name) return '';
  return name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
}

// Modal component inline for simplicity
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.24)',zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:14,padding:'28px 24px',minWidth:320,maxWidth:350,width:'92vw',boxShadow:'0 8px 48px #026b3928',position:'relative'}}>
        <button style={{position:'absolute',top:8,right:16,fontSize:27,color:'#388688',background:'none',border:'none',fontWeight:700,cursor:'pointer'}} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

const Settings = () => {
  const [name, setName] = useState('Inspector Davis');
  const [email, setEmail] = useState('inspector.davis@email.com');
  const [contact, setContact] = useState('09171234567');
  const [address, setAddress] = useState('IT Park, Cebu City');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [editingPassword, setEditingPassword] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [googleAuth, setGoogleAuth] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null); // Stores URL of uploaded pic
  const [uploadOrigin, setUploadOrigin] = useState(null); // File object for preview+reset
  const [uploadErr, setUploadErr] = useState('');

  function handleProfileEdit(e) {
    e.preventDefault();
    if (!name || !email || !contact || !address) {
      setEditError('All fields are required.');
      setEditSuccess('');
      return;
    }
    setEditError('');
    setEditSuccess('Profile successfully saved!');
    setTimeout(()=>setEditSuccess(''), 1500);
  }

  function handlePasswordSave() {
    if (!newPass.trim()) {
      setEditError('Password is required');
      return;
    }
    setEditError('');
    setEditSuccess('Password changed!');
    setEditingPassword(false);
    setTimeout(()=>setEditSuccess(''), 1500);
  }
  // Profile Picture Modal handlers
  function onAvatarClick() {
    setModalOpen(true);
    setUploadErr('');
  }
  function handleUpload(e) {
    setUploadErr('');
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadErr('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadErr('Image must be less than 5MB.');
      return;
    }
    setUploadOrigin(file);
    setProfilePic(URL.createObjectURL(file));
  }
  function handleRemovePic() {
    setProfilePic(null);
    setUploadOrigin(null);
    setUploadErr('');
  }
  function handleSavePic() {
    if (profilePic) {
      setModalOpen(false);
      setUploadErr('');
    } else {
      setUploadErr('Please select an image to upload.');
    }
  }

  return (
    <div style={{maxWidth:540,margin:'38px auto',padding:'0 10px',fontFamily:'Segoe UI,sans-serif'}}>
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)}>
        <div style={{textAlign:'center',margin:'20px 0'}}>
          <div style={{fontWeight:700,fontSize:19,color:'#219487',marginBottom:10}}>Profile Picture</div>
          {profilePic
            ? <img alt="Profile" src={profilePic} style={{width:98,height:98,borderRadius:'50%',boxShadow:'0 2px 14px #b8d0e252',objectFit:'cover',marginBottom:14}} />
            : <div style={{width:98,height:98,borderRadius:'50%',background:'#e5ece9',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:38,color:'#389982',margin:'0 auto 14px'}}>{getInitials(name)}</div>
          }
          <div style={{marginBottom:10}}>
            <input id="profile-upload" type="file" accept="image/*" style={{display:'none'}} onChange={handleUpload} />
            <label htmlFor="profile-upload" style={{background:'#e9eedc',color:'#338678',fontWeight:700,border:'none',borderRadius:8,padding:'10px 22px',fontSize:16,marginBottom:0,cursor:'pointer',display:'inline-block'}}>Upload {profilePic ? 'New' : ''} Picture</label>
          </div>
          { uploadOrigin && profilePic && (
            <button type="button" onClick={handleRemovePic} style={{background:'#ea5757',color:'#fff',fontWeight:700,border:'none',borderRadius:8,padding:'9px 19px',fontSize:15,margin:'8px 0',cursor:'pointer'}}>Remove</button>
          )}
          {uploadErr && <div style={{color:'#d81a1a',fontWeight:600,margin:'10px 0 4px'}}>{uploadErr}</div>}
          <div style={{margin:'18px 0 0'}}>
            <button type="button" onClick={handleSavePic} style={{background:'#26bd5b',color:'#fff',border:'none',borderRadius:8,padding:'12px 43px',fontWeight:700,fontSize:17,marginTop:3,cursor:'pointer', boxShadow:'0 2px 10px #b9ebe08c'}}>Save</button>
          </div>
        </div>
      </Modal>
      <div style={{background:'#fff',borderRadius:14,boxShadow:'0 2px 16px #e6f0ee',padding:'24px 32px',marginBottom:32,border:'1.5px solid #e2eeea'}}>
        <h2 style={{fontWeight:700,fontSize:26,color:'#219487',margin:'0 0 24px'}}>Personal Information</h2>
        <form onSubmit={handleProfileEdit}>
          <div style={{display:'flex',gap:18,alignItems:'flex-start',flexWrap:'wrap',marginBottom:22}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',flex:'0 0 74px'}}>
              <div onClick={onAvatarClick} style={{cursor:'pointer',width:74,height:74,borderRadius:'50%',background:'#e3ecea',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:33,color:'#238a80',marginTop:2,letterSpacing:2,boxShadow: profilePic?'0 2px 16px #b2ddd926':'none',overflow:'hidden'}}>
                {profilePic
                  ? <img alt="Profile" src={profilePic} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
                  : getInitials(name)
                }
              </div>
            </div>
            <div style={{flex:'1 1 220px',minWidth:200}}>
              <div style={{marginBottom:16}}>
                <label style={{fontWeight:600, fontSize:15,marginBottom:6,display:'block'}}>Full Name*</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:7,border:'1.5px solid #b9ebe0',fontSize:16,background:'#fafdff'}} required />
              </div>
              <div style={{marginBottom:16}}>
                <label style={{fontWeight:600, fontSize:15,marginBottom:6,display:'block'}}>Email Address*</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:7,border:'1.5px solid #b9ebe0',fontSize:16,background:'#fafdff'}} required />
              </div>
              <div style={{marginBottom:16}}>
                <label style={{fontWeight:600, fontSize:15,marginBottom:6,display:'block'}}>Contact Number*</label>
                <input type="tel" value={contact} onChange={e=>setContact(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:7,border:'1.5px solid #b9ebe0',fontSize:16,background:'#fafdff'}} required />
              </div>
              <div style={{marginBottom:14}}>
                <label style={{fontWeight:600, fontSize:15,marginBottom:6,display:'block'}}>Address*</label>
                <textarea value={address} onChange={e=>setAddress(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:7,border:'1.5px solid #b9ebe0',fontSize:16,background:'#fafdff',resize:'vertical',minHeight:48}} required />
              </div>
              {editError && <div style={{background:'#fff4f4',color:'#b31212',fontWeight:600,padding:'10px 14px',borderRadius:7,margin:'7px 0 4px',fontSize:15,border:'1px solid #ffecec'}}>{editError}</div>}
              {editSuccess && <div style={{background:'#edfbf2',color:'#1a7e46',fontWeight:600,padding:'10px 16px',borderRadius:8,margin:'7px 0 8px',fontSize:15,border:'1.5px solid #c6eeda',boxShadow:'0 2px 12px #b7efe91a'}}>{editSuccess}</div>}
              <button type="submit" style={{background:'#26bd5b',color:'#fff',border:'none',borderRadius:8,padding:'13px 0',fontWeight:700,fontSize:16,width:'100%',marginTop:4,cursor:'pointer', boxShadow:'0 2px 10px #b9ebe08c'}}>Edit Profile</button>
            </div>
          </div>
        </form>
      </div>
      <div style={{background:'#fff',borderRadius:14,boxShadow:'0 2px 16px #e6f0ee',padding:'24px 32px', marginBottom:32,border:'1.5px solid #e2eeea'}}>
        <h2 style={{fontWeight:700,fontSize:26,color:'#219487',margin:'0 0 24px'}}>Security Settings</h2>
        <div style={{display:'flex',flexDirection:'column',gap:30}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',marginBottom:8,gap:14}}>
            <div style={{fontWeight:600,fontSize:15}}>Change Password</div>
            {
              editingPassword
                ? <>
                    <input value={newPass} onChange={e=>setNewPass(e.target.value)} type="password" placeholder="New password..." style={{width:190,padding:'10px',borderRadius:7,border:'1.5px solid #b9ebe0',fontSize:15,marginRight:12}} />
                    <button type="button" onClick={handlePasswordSave} style={{background:'#26bd5b',color:'#fff',border:'none',borderRadius:7,padding:'8px 22px',fontWeight:700,fontSize:14,cursor:'pointer',marginRight:6}}>Save</button>
                    <button type="button" onClick={()=>{setEditingPassword(false);setNewPass('');}} style={{background:'#e9eedc',color:'#338678',fontWeight:700,border:'none',borderRadius:7,padding:'8px 18px',fontSize:14,cursor:'pointer'}}>Cancel</button>
                  </>
                : <button type="button" onClick={()=>setEditingPassword(true)} style={{background:'none',color:'#2374dc',fontWeight:700,border:'none',borderRadius:7,padding:'8px 13px',fontSize:15, cursor:'pointer',textDecoration:'underline',marginLeft:4}}>Change Password</button>
            }
          </div>
          <div style={{fontWeight:600,fontSize:15,marginBottom:6}}>Email Authentication</div>
          <div style={{display:'flex',alignItems:'center',gap:10,background:'#f7fafb',border:'1.2px solid #b9ebe0',borderRadius:8,padding:'12px 15px'}}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" style={{width:28,height:28,marginRight:5}} />
            <span style={{fontWeight:500,fontSize:15,marginRight:18}}>Google Account <span style={{color:'#7b8a92',fontWeight:400,fontSize:14,marginLeft:7}}>Connect your Google account for easy sign-in</span></span>
            <div style={{marginLeft:'auto'}}>
              <label style={{position:'relative',display:'inline-block',width:44,height:24}}>
                <input type="checkbox" checked={googleAuth} onChange={e=>setGoogleAuth(e.target.checked)} style={{opacity:0,width:0,height:0}} />
                <span style={{position:'absolute',cursor:'pointer',top:0,left:0,right:0,bottom:0,background:googleAuth?'#26bd5b':'#bbb',borderRadius:14,transition:'.2s'}}></span>
                <span style={{position:'absolute',height:18,width:18,left:googleAuth?'22px':'4px',bottom:3,background:'#fff',borderRadius:'50%',transition:'.2s',boxShadow:'0 1px 3px #8883'}}></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
