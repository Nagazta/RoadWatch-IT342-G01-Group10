import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import Sidebar from '../common/Sidebar';
import Header from './Header';
// Optionally import NotificationsModal if needed for inspector notifications
// import NotificationsModal from '../modal/NotificationModal';

const InspectorLayout = ({ children, activeMenuItem, pageTitle }) => {
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
        // Implement inspector profile navigation
        break;
      case 'settings':
        // Consider navigating to inspector settings page
        navigate('/inspector/settings');
        break;
      case 'help':
        // Optionally handle help action
        break;
      case 'logout':
        localStorage.removeItem('token');
        navigate('/');
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
            role="inspector"
            activeItem={activeMenuItem}
            onNavigate={handleNavigate}
          />
        }
        header={
          <Header
            pageTitle={pageTitle}
            userName="Inspector User"
            userRole="Inspector"
            userAvatar="IN"
            notificationCount={2}
            onProfileClick={handleHeaderAction}
            onNotificationClick={() => setShowNotifications(true)} 
          />
        }
      >
        {children}
      </MainLayout>
      {/* Implement notification modal as needed */}
      {/* <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        userRole="inspector"
      /> */}
    </>
  );
};

export default InspectorLayout;
