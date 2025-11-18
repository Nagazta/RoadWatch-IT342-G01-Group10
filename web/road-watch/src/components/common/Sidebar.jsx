import React, { useState } from 'react'; 
import {
  DashboardIcon,
  ReportsIcon,
  UsersIcon,
  AuditIcon,
  SettingsIcon,
  SupportIcon,
  LogoutIcon,
  RoadWatchLogoIcon,
  AssignmentIcon,
  PlusIcon
} from './Icons';
import logo from '../../assets/images/logo.png';
import './Sidebar.css';
import LogoutModal from '../modal/LogoutModal';

const Sidebar = ({ activeItem = 'dashboard', onNavigate, role = 'admin' }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const roleBasedNav = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
      { id: 'reports', label: 'Reports Management', icon: <ReportsIcon />, path: '/admin/reports' },
      { id: 'users', label: 'User Management', icon: <UsersIcon />, path: '/admin/users' },
      { id: 'audit', label: 'Audit Logs', icon: <AuditIcon />, path: '/admin/audit' },
      { id: 'settings', label: 'System Settings', icon: <SettingsIcon />, path: '/admin/settings' },
      { id: 'support', label: 'Feedback & Support', icon: <SupportIcon />, path: '/admin/support' },
      { id: 'assign_inspector', label: 'Assign Inspectors', icon: <AssignmentIcon />, path: '/admin/assign-inspectors' }
    ],
    inspector: [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/inspector/dashboard' },
      { id: 'search_reports', label: 'Search Reports', icon: <ReportsIcon />, path: '/inspector/search-reports' },
      { id: 'assigned_reports', label: 'Assigned Reports', icon: <AssignmentIcon />, path: '/inspector/assigned-reports' },
      { id: 'create_report', label: 'Create Report', icon: <PlusIcon />, path: '/inspector/create-report' },
      { id: 'settings', label: 'Settings', icon: <SettingsIcon />, path: '/inspector/settings' },
    ],
    citizen: [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/citizen/dashboard' },
      { id: 'reports', label: 'My Reports', icon: <ReportsIcon />, path: '/citizen/reports' },
      { id: 'submit', label: 'Submit Report', icon: <PlusIcon />, path: '/citizen/submit' },
      { id: 'settings', label: 'Settings', icon: <SettingsIcon />, path: '/citizen/settings' },
      { id: 'support', label: 'Feedback & Support', icon: <SupportIcon />, path: '/citizen/support'}
    ]
  };

  const navItems = roleBasedNav[role] || [];

  const handleNavClick = (item) => {
    if (onNavigate) onNavigate(item);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    console.log('Logging out...');
    setShowLogoutModal(false);
  };

  const handleCloseLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <aside className="sidebar">
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={logo} alt="RoadWatch Logo" className='sidebar-logo' />
          </div>
          <h1 className="sidebar-title">RoadWatch</h1>
          <p className="sidebar-subtitle">{role.charAt(0).toUpperCase() + role.slice(1)} Panel</p>
        </div>

        {/* Nav Menu */}
        <nav className="sidebar-nav" role="navigation">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeItem === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item)}
                  aria-current={activeItem === item.id ? 'page' : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogoutClick}>
            <span className="logout-icon"><LogoutIcon /></span>
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleCloseLogout}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Sidebar;