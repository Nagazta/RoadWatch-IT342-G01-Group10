import './styles/CitizenSettings.css';
import { useState, useEffect } from 'react';
import { UserCircleIcon, UploadIcon } from '../../components/common/Icons';
import authService from '../../services/api/authService';
import ToggleSwitch from '../../components/settings/ToggleSwitch';

const CitizenSettings = () =>
{
    const [originalUser, setOriginalUser] = useState({});
    const [currentUser, setCurrentUser] = useState
    ({
        contact: '',
        email: '',
        id: 0,
        name: '',
        role: '',
        supabaseId: '',
        username: ''
    });

    useEffect(() =>
    {
        const user = authService.getCurrentUser();
        setOriginalUser(user);
        setCurrentUser(user);
        
    }, []);

    const handleSave = async() =>
    {
        if(currentUser.name && currentUser.contact)
        {
            if(JSON.stringify(currentUser) === JSON.stringify(originalUser))
            {
                alert('No changes made');
                return;
            }
            else if(window.confirm('Are you sure you want to save changes?'))
            {
                const response = await authService.updateCitizen(currentUser.id, currentUser);

                if(response.success)
                {
                    alert('Profile updated!');
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    window.location.reload();
                }
            }
        }   
        else
        {
            alert('Fields cannot be blank');
        }
    };

    return (
        <div className="citizen-settings">
            <div className="profile-info">
                <h3> Profile Information </h3>
                <p> Update your personal details and contact information </p>

                <div className="avatar">
                    <UserCircleIcon/>
                    <button> <UploadIcon/> Change </button>
                </div>

                <label htmlFor="name"> Full Name </label>
                <input
                    id="name" 
                    name="name"
                    type="text" 
                    placeholder="Maria Santos"
                    value={currentUser.name}
                    onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                    onBlur={() => setCurrentUser(prev => ({...prev, name: prev.name.trimEnd()}))}
                />

                <label htmlFor="email"> Email </label>
                <input type="email" placeholder="maria.santos@example.com" value={currentUser.email} disabled/>
                <p className="cannot-change"> Email cannot be changed </p>

                <label htmlFor="contact"> Contact Number </label>
                <input 
                    id="contact"
                    name="contact"
                    type="text" 
                    placeholder="09123456789"
                    value={currentUser.contact}
                    onChange={(e) => setCurrentUser({...currentUser, contact: e.target.value})}
                    onBlur={() => setCurrentUser(prev => ({...prev, contact: prev.contact.trimEnd()}))}
                />

                <button className="save-changes" onClick={handleSave}> Save Changes </button>
            </div>

            <div className="notification-preferences">
                <h3> Notification Preferences </h3>
                <p> Choose how you want to receive updates about your reports </p>

                <div className="toggle-preference">
                    <div>
                        <h4> Email Notifications </h4>
                        <p> Receive updates vial email </p>
                    </div>
                    <ToggleSwitch />
                </div>
                <hr/>
                <div className="toggle-preference">
                    <div>
                        <h4> SMS Notifications </h4>
                        <p> Receive updates vial text message </p>
                    </div>
                    <ToggleSwitch />
                </div>
                <hr/>
                <div className="toggle-preference">
                    <div>
                        <h4> App Push Notifications </h4>
                        <p> Receive push notifications in the app </p>
                    </div>
                    <ToggleSwitch />
                </div>
            </div>

            <div className="account-security">
                <h3> Account Security </h3>
                <p> Manage your password and security settings </p>

                <div className="password">
                    <div>
                        <h4> Password </h4>
                        <p> Keep your account secure with a strong password </p>
                    </div>
                    <button> Change Password </button>
                </div>
                <hr/>
                <div className="toggle-preference">
                    <div>
                        <h4> Two-Factor Authentication </h4>
                        <p> Add an extra layer of security to your account </p>
                    </div>
                    <ToggleSwitch />
                </div>
            </div>

            <div className="privacy-settings">
                <h3> Privacy Settings </h3>
                <p> Control your data sharing and privacy preferences </p>

                <div className="toggle-preference">
                    <div>
                        <h4> Location Sharing </h4>
                        <p> Enable GPS auto-location for reports </p>
                    </div>
                    <ToggleSwitch />
                </div>
            </div>

            <div className="danger-zone"> 
                <h3> Danger Zone </h3>
                <p> Irreversible actions that will permanently affect your account </p>

                <div className="delete">
                    <div>
                        <h4> Delete My Account </h4>
                        <p> Once you delete your account, there is no going back. All your data will be permanently deleted. </p>
                    </div>
                    <button> Delete Account </button>
                </div>
            </div>
        </div>
    );
};

export default CitizenSettings;