import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import Sidebar from '../common/Sidebar';
import Header from './Header';
// Optionally import NotificationsModal if needed for inspector notifications
// Optionally import NotificationsModal if needed for inspector notifications
import NotificationsModal from '../modal/NotificationModal';
import authService from '../../services/api/authService';

const InspectorLayout = ({ children, activeMenuItem, pageTitle }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Inspector User',
    role: 'Inspector',
    avatar: 'IN'
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      const getInitials = (name) => {
        return name
          ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
          : 'IN';
      };

      setCurrentUser({
        name: user.name || 'Inspector User',
        role: 'Inspector', // Hardcoded as this is inspector layout
        avatar: getInitials(user.name)
      });
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
        // Implement inspector profile navigation
        navigate('/inspector/settings');
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
            userName={currentUser.name}
            userRole={currentUser.role}
            userAvatar={currentUser.avatar}
            notificationCount={2}
            onProfileClick={handleHeaderAction}
            onNotificationClick={() => setShowNotifications(true)}
          />
        }
      >
        {children}
      </MainLayout>
      {/* Implement notification modal as needed */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        userRole="inspector"
      />
    </>
  );
};

export default InspectorLayout;
