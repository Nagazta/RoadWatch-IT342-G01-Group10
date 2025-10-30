import { useNavigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import Sidebar from '../common/Sidebar';
import Header from './Header';

const AdminLayout = ({ children, activeMenuItem, pageTitle }) => {
  const navigate = useNavigate();

  const handleNavigate = (item) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
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
        />
      }
    >
      {children}
    </MainLayout>
  );
};

export default AdminLayout;
