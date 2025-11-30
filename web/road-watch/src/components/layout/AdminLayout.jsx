import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import Sidebar from '../common/Sidebar';
import Header from './Header';
import NotificationsModal from '../modal/NotificationModal';

const AdminLayout = ({ children, activeMenuItem, pageTitle }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [userData, setUserData] = useState({ name: 'Admin User', role: 'Administrator', avatar: 'AD' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const initials = (user.name || user.username || 'AD')
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        setUserData({
          name: user.name || user.username || 'Admin User',
          role: user.role || 'Administrator',
          avatar: initials || 'AD'
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleNavigate = (item) => {
    if (item.path) {
      navigate(item.path);
    }
  };

 const handleHeaderAction = (action) => {
    switch (action) {
      case 'profile':
        navigate('/admin/profile');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      case 'help':
        navigate('/admin/help');
        break;
      case 'logout':
        localStorage.removeItem('token');
        navigate('/login');
        break;
      default:
        break;
    }
  };

    return (
    <>
      <MainLayout
        sidebar={
          <Sidebar
            role="admin"
            activeItem={activeMenuItem}
            onNavigate={handleNavigate}      
          />
        }
        header={
          <Header
            pageTitle={pageTitle}
            userName={userData.name}
            userRole={userData.role}
            userAvatar={userData.avatar}
            notificationCount={3}
            onProfileClick={handleHeaderAction}
            onNotificationClick={() => setShowNotifications(true)} 
          />        
        }
      >
        {children}
      </MainLayout>

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        userRole="admin"
      />
    </>
  );
};

export default AdminLayout;
