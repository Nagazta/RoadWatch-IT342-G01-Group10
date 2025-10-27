/**
 * Header Component
 * Top navigation header with search, notifications, and user profile (Desktop only)
 * Props: pageTitle, notificationCount, userName, userRole, userAvatar
 */

import { useState, useEffect, useRef } from 'react';
import {
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  LogoutIcon
} from '../common/Icons';
import './Header.css';

const Header = ({
  pageTitle = 'Dashboard Overview',
  notificationCount = 3,
  userName = 'Admin User',
  userRole = 'Administrator',
  userAvatar = 'AD', // Can be initials or image URL
  onSearchChange,
  onNotificationClick,
  onProfileClick,
  onLogout
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Call parent callback if provided
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // Handle notification click
  const handleNotificationClick = () => {
    console.log('Notifications clicked');

    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  // Toggle profile dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);

    if (onProfileClick && !showDropdown) {
      onProfileClick();
    }
  };

  // Handle dropdown item clicks
  const handleDropdownItemClick = (action) => {
    setShowDropdown(false);

    switch (action) {
      case 'profile':
        console.log('Profile clicked');
        break;
      case 'settings':
        console.log('Settings clicked');
        break;
      case 'help':
        console.log('Help clicked');
        break;
      case 'logout':
        console.log('Logout clicked');
        if (onLogout) {
          onLogout();
        }
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Check if avatar is an image URL or initials
  const isImageUrl = userAvatar && (userAvatar.startsWith('http') || userAvatar.startsWith('/'));

  return (
    <header className="header">
      {/* Left Section - Page Title */}
      <div className="header-left">
        <h1 className="header-title">{pageTitle}</h1>
      </div>

      {/* Center Section - Search Bar */}
      <div className="header-center">
        <div className="header-search">
          <div className="search-icon">
            <SearchIcon />
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search reports"
          />
        </div>
      </div>

      {/* Right Section - Notifications & User Profile */}
      <div className="header-right">
        <div className="header-actions">
          {/* Notification Bell */}
          <div
            className="notification-container"
            onClick={handleNotificationClick}
            role="button"
            tabIndex={0}
            aria-label="Notifications"
          >
            <div className="notification-icon">
              <BellIcon />
            </div>
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </div>

          {/* User Profile */}
          <div
            className="user-profile"
            onClick={toggleDropdown}
            ref={dropdownRef}
            role="button"
            tabIndex={0}
            aria-label="User profile menu"
            aria-expanded={showDropdown}
          >
            <div className="user-avatar">
              {isImageUrl ? (
                <img src={userAvatar} alt={userName} />
              ) : (
                <span>{userAvatar}</span>
              )}
            </div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-role">{userRole}</div>
            </div>
            <div className="dropdown-icon">
              <ChevronDownIcon />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="profile-dropdown">
                <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownItemClick('profile');
                  }}
                >
                  <UserCircleIcon />
                  <span>Profile</span>
                </div>
                <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownItemClick('settings');
                  }}
                >
                  <CogIcon />
                  <span>Settings</span>
                </div>
                <div
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownItemClick('help');
                  }}
                >
                  <QuestionMarkCircleIcon />
                  <span>Help</span>
                </div>
                <div
                  className="dropdown-item logout"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownItemClick('logout');
                  }}
                >
                  <LogoutIcon />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
