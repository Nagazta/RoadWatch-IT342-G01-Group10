import { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import MainLayout from './MainLayout';
import Sidebar from '../common/Sidebar';
import Header from './Header';
import NotificationsModal from '../modal/NotificationModal';

const AdminLayout = ({ children, activeMenuItem, pageTitle }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

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
            userName="Admin User"
            userRole="Administrator"
            userAvatar="AD"
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
