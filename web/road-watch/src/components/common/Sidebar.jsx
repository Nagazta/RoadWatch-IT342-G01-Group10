import {
  DashboardIcon,
  ReportsIcon,
  UsersIcon,
  AuditIcon,
  SettingsIcon,
  SupportIcon,
  LogoutIcon,
  RoadWatchLogoIcon
} from './Icons';
import './Sidebar.css';

const Sidebar = ({ activeItem = 'dashboard', onNavigate, role = 'admin' }) => {
  const roleBasedNav = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
      { id: 'reports', label: 'Reports Management', icon: <ReportsIcon />, path: '/admin/reports' },
      { id: 'users', label: 'User Management', icon: <UsersIcon />, path: '/admin/users' },
      { id: 'audit', label: 'Audit Logs', icon: <AuditIcon />, path: '/admin/audit' },
      { id: 'settings', label: 'System Settings', icon: <SettingsIcon />, path: '/admin/settings' },
      { id: 'support', label: 'Feedback & Support', icon: <SupportIcon />, path: '/admin/support' }
    ],
    inspector: [
    
    ],
    citizen: [
     
    ]
  };

  const navItems = roleBasedNav[role] || [];

  const handleNavClick = (item) => {
    if (onNavigate) onNavigate(item);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // TODO: Clear auth and redirect to login
  };

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <RoadWatchLogoIcon />
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
        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon"><LogoutIcon /></span>
          LOGOUT
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
