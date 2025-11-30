import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainLayout from './MainLayout';
import Sidebar from '../common/Sidebar';
import Header from './Header';

const CitizenLayout = ({ children, activeMenuItem, pageTitle }) =>
{
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ name: 'Citizen User', role: 'Citizen', avatar: 'CU' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                const initials = (user.name || user.username || 'CU')
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                setUserData({
                    name: user.name || user.username || 'Citizen User',
                    role: user.role || 'Citizen',
                    avatar: initials || 'CU'
                });
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const handleNavigate = (item) =>
    {
        if(item.path)
            navigate(item.path);
    };

    const handleHeaderAction = (action) => {
        switch (action) {
            case 'profile':
                navigate('/citizen/profile');
                break;
            case 'settings':
                navigate('/citizen/settings');
                break;
            case 'help':
                navigate('/citizen/help');
                break;
            case 'logout':
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                navigate('/');
                break;
            default:
                break;
        }
    };

    return (
        <>
            <MainLayout
                sidebar={ <Sidebar role="citizen" activeItem={activeMenuItem} onNavigate={handleNavigate} /> } 
                header={ <Header pageTitle={pageTitle} userName={userData.name} userRole={userData.role} userAvatar={userData.avatar} notificationCount={1} onProfileClick={handleHeaderAction} /> }
            >
                {children}
            </MainLayout>
        </>
    );
};

export default CitizenLayout;