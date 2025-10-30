import React, { useState } from 'react';
import { AlertIcon, MessageIcon, XIcon, CheckIcon, ClockIcon, ExternalLinkIcon, MoreVerticalIcon } from '../common/Icons';
import '../modal/styles/NotificationsModal.css';

const NotificationsModal = ({ isOpen, onClose, userRole = 'citizen' }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState(null);
  
  const allNotifications = [
    // ADMIN NOTIFICATIONS
    {
      id: 1,
      title: 'New User Registration',
      message: 'A new citizen user has registered and is awaiting approval.',
      fullMessage: 'User Maria Santos (maria.santos@email.com) has registered as a citizen and is awaiting account approval. Please review their information and approve or reject their registration.',
      type: 'Admin Alert',
      icon: 'alert',
      iconColor: '#1565c0',
      iconBg: '#bbdefb',
      timestamp: '2025-10-22 10:30',
      isRead: false,
      isNew: true,
      relatedLink: '/admin/users',
      visibleTo: ['admin']
    },
    {
      id: 2,
      title: 'System Backup Completed',
      message: 'The scheduled system backup has been completed successfully.',
      fullMessage: 'The automated system backup scheduled for 2:00 AM has been completed successfully. All data has been backed up to the secure server. Next backup is scheduled for tomorrow at 2:00 AM.',
      type: 'System Alert',
      icon: 'check',
      iconColor: '#2e7d32',
      iconBg: '#c8e6c9',
      timestamp: '2025-10-22 02:15',
      isRead: false,
      isNew: false,
      relatedLink: null,
      visibleTo: ['admin']
    },
    {
      id: 3,
      title: 'High Priority Report Submitted',
      message: 'A critical road damage report requires immediate attention.',
      fullMessage: 'Report #145 has been submitted with high priority. The issue involves major road damage on N. Bacalso Avenue that poses a safety hazard. Please assign an inspector immediately.',
      type: 'Admin Alert',
      icon: 'alert',
      iconColor: '#d32f2f',
      iconBg: '#ffcdd2',
      timestamp: '2025-10-22 09:45',
      isRead: false,
      isNew: true,
      relatedLink: '/admin/reports/145',
      visibleTo: ['admin']
    },

    // INSPECTOR NOTIFICATIONS
    {
      id: 4,
      title: 'New Report Assigned: Pothole on Osmeña Blvd',
      message: 'You have been assigned to inspect Report #125.',
      fullMessage: 'Admin has assigned you to inspect Report #125: Pothole on Osmeña Boulevard. Please review the report details and conduct your inspection within 48 hours. Submit your findings through the inspection form.',
      type: 'Assignment',
      icon: 'alert',
      iconColor: '#f57f17',
      iconBg: '#fff9c4',
      timestamp: '2025-10-21 14:00',
      isRead: false,
      isNew: true,
      relatedLink: '/inspector/reports/125',
      visibleTo: ['inspector']
    },
    {
      id: 5,
      title: 'Inspection Deadline Reminder',
      message: 'Report #118 inspection is due tomorrow.',
      fullMessage: 'This is a reminder that your inspection for Report #118 (Road crack near IT Park) is due tomorrow at 5:00 PM. Please complete and submit your inspection report before the deadline.',
      type: 'Reminder',
      icon: 'alert',
      iconColor: '#f57f17',
      iconBg: '#fff9c4',
      timestamp: '2025-10-20 10:00',
      isRead: false,
      isNew: false,
      relatedLink: '/inspector/reports/118',
      visibleTo: ['inspector']
    },
    {
      id: 6,
      title: 'Inspection Report Approved',
      message: 'Your inspection report for #118 has been approved by admin.',
      fullMessage: 'Your inspection report for Report #118 has been reviewed and approved by the admin. The repair work has been scheduled based on your recommendations. Great work!',
      type: 'Report Update',
      icon: 'check',
      iconColor: '#2e7d32',
      iconBg: '#c8e6c9',
      timestamp: '2025-10-19 16:30',
      isRead: false,
      isNew: false,
      relatedLink: '/inspector/reports/118',
      visibleTo: ['inspector']
    },

    // CITIZEN NOTIFICATIONS
    {
      id: 7,
      title: 'Pothole Report #125 Approved',
      message: 'Your submitted report has been approved by the inspector.',
      fullMessage: 'Your pothole report (ID: #125) submitted on October 18, 2025 has been reviewed and approved by Inspector Juan Reyes. The repair work has been scheduled for October 25, 2025. You will receive another notification once the work is completed.',
      type: 'Report Update',
      icon: 'check',
      iconColor: '#2e7d32',
      iconBg: '#c8e6c9',
      timestamp: '2025-10-21 14:32',
      isRead: false,
      isNew: true,
      relatedLink: '/citizen/reports/125',
      visibleTo: ['citizen', 'inspector', 'admin']
    },
    {
      id: 8,
      title: 'Road Damage Report #118 Completed',
      message: 'The repair work for your reported issue has been completed.',
      fullMessage: 'The road damage report (ID: #118) you submitted has been successfully repaired. Our team has completed the work and the area is now safe for use. Thank you for your contribution to improving our roads.',
      type: 'Report Update',
      icon: 'check',
      iconColor: '#2e7d32',
      iconBg: '#c8e6c9',
      timestamp: '2025-10-20 16:45',
      isRead: false,
      isNew: false,
      relatedLink: '/citizen/reports/118',
      visibleTo: ['citizen', 'inspector', 'admin']
    },
    {
      id: 9,
      title: 'Report #132 Under Review',
      message: 'Your report is currently being reviewed by our team.',
      fullMessage: 'Your report (ID: #132) has been received and is currently under review by our inspection team. We will notify you once the review is complete and action has been taken. Expected review time: 2-3 business days.',
      type: 'Report Update',
      icon: 'alert',
      iconColor: '#1565c0',
      iconBg: '#bbdefb',
      timestamp: '2025-10-22 09:15',
      isRead: false,
      isNew: true,
      relatedLink: '/citizen/reports/132',
      visibleTo: ['citizen', 'inspector', 'admin']
    },

    // SHARED NOTIFICATIONS (visible to all)
    {
      id: 10,
      title: 'Server Maintenance Scheduled',
      message: 'Scheduled maintenance from 12AM to 3AM tomorrow.',
      fullMessage: 'The system will undergo scheduled maintenance from 12AM to 3AM tomorrow. During this time, the service may be temporarily unavailable. We apologize for any inconvenience. Please save your work before the maintenance window.',
      type: 'System Alert',
      icon: 'alert',
      iconColor: '#f57f17',
      iconBg: '#fff9c4',
      timestamp: '2025-10-20 09:15',
      isRead: false,
      isNew: false,
      relatedLink: null,
      visibleTo: ['admin', 'inspector', 'citizen']
    },
    {
      id: 11,
      title: 'New Feature: Dark Mode Available',
      message: 'You can now enable dark mode in your settings.',
      fullMessage: 'Dark mode is now available! You can enable it in your account settings under Appearance preferences. This feature helps reduce eye strain during nighttime use. Try it out today!',
      type: 'System Alert',
      icon: 'alert',
      iconColor: '#f57f17',
      iconBg: '#fff9c4',
      timestamp: '2025-10-21 10:20',
      isRead: false,
      isNew: true,
      relatedLink: '/settings',
      visibleTo: ['admin', 'inspector', 'citizen']
    },
    {
      id: 12,
      title: 'Policy Update - New Reporting Guidelines',
      message: 'Please review the updated reporting guidelines.',
      fullMessage: 'We have updated our reporting guidelines to improve the quality and consistency of reports. Please review the new guidelines in the Help section before submitting your next report. Key changes include improved photo requirements and location accuracy.',
      type: 'Announcement',
      icon: 'message',
      iconColor: '#1565c0',
      iconBg: '#bbdefb',
      timestamp: '2025-10-22 08:50',
      isRead: false,
      isNew: false,
      relatedLink: '/guidelines',
      visibleTo: ['admin', 'inspector', 'citizen']
    },
    {
      id: 13,
      title: 'Thank You for Your Contribution',
      message: 'Your reports are making a difference in our community.',
      fullMessage: 'Thank you for being an active member of our community! Your reports help us identify and fix issues quickly, making our roads safer for everyone. Your contributions this month: 5 reports submitted, 3 resolved. Keep up the great work!',
      type: 'Announcement',
      icon: 'message',
      iconColor: '#1565c0',
      iconBg: '#bbdefb',
      timestamp: '2025-10-19 11:30',
      isRead: false,
      isNew: false,
      relatedLink: null,
      visibleTo: ['citizen']
    }
  ];

  // Filter notifications based on user role
  const [notifications, setNotifications] = useState(
    allNotifications.filter(notification => 
      notification.visibleTo.includes(userRole.toLowerCase())
    )
  );

  if (!isOpen) return null;

  // Get role-specific tabs
  const getRoleTabs = () => {
    switch (userRole.toLowerCase()) {
      case 'admin':
        return ['All', 'Admin Alerts', 'Report Updates', 'System Alerts'];
      case 'inspector':
        return ['All', 'Assignments', 'Reminders', 'Report Updates'];
      case 'citizen':
        return ['All', 'Report Updates', 'Announcements', 'System Alerts'];
      default:
        return ['All'];
    }
  };

  const tabs = getRoleTabs();

  const getFilteredNotifications = () => {
    if (activeTab === 'All') return notifications;
    
    // Map tab names to notification types
    const typeMapping = {
      'Admin Alerts': 'Admin Alert',
      'Report Updates': 'Report Update',
      'System Alerts': 'System Alert',
      'Assignments': 'Assignment',
      'Reminders': 'Reminder',
      'Announcements': 'Announcement'
    };

    const targetType = typeMapping[activeTab];
    return notifications.filter(n => n.type === targetType);
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true, isNew: false })));
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    // Mark as read when clicked
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, isRead: true, isNew: false } : n
    ));
  };

  const handleBackToList = () => {
    setSelectedNotification(null);
  };

  const handleClose = () => {
    setSelectedNotification(null);
    onClose();
  };

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'check':
        return <CheckIcon />;
      case 'alert':
        return <AlertIcon />;
      case 'message':
        return <MessageIcon />;
      default:
        return <CheckIcon />;
    }
  };

  // If viewing notification details
  if (selectedNotification) {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content notifications-modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="notifications-modal-header">
            <div className="notification-detail-header">
              <div 
                className="notification-detail-icon" 
                style={{ backgroundColor: selectedNotification.iconBg, color: selectedNotification.iconColor }}
              >
                {getIcon(selectedNotification.icon)}
              </div>
              <h2 className="notification-detail-title">{selectedNotification.title}</h2>
            </div>
            <div className="notification-header-actions">
              <span className="notification-read-badge">Read</span>
              <button className="modal-close-btn" onClick={handleClose}>
                <XIcon />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body notifications-detail-body">
            {/* Meta Information */}
            <div className="notification-meta">
              <div className="notification-meta-item">
                <span className="notification-meta-dot" style={{ backgroundColor: getMetaColor(selectedNotification.type) }}></span>
                <span className="notification-meta-label">Type:</span>
                <span className="notification-meta-value">{selectedNotification.type}</span>
              </div>
              <div className="notification-meta-item">
                <ClockIcon />
                <span className="notification-meta-label">Received:</span>
                <span className="notification-meta-value">{selectedNotification.timestamp}</span>
              </div>
            </div>

            {/* Message */}
            <div className="notification-message-section">
              <h3 className="notification-section-title">Message</h3>
              <p className="notification-full-message">{selectedNotification.fullMessage}</p>
            </div>

            {/* Related Link */}
            {selectedNotification.relatedLink && (
              <div className="notification-related-section">
                <h3 className="notification-section-title">Related Link</h3>
                <a href={selectedNotification.relatedLink} className="notification-related-link">
                  <ExternalLinkIcon />
                  <span>View Related Item</span>
                </a>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="modal-btn save-btn" onClick={handleBackToList}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main notifications list view
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content notifications-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="notifications-modal-header">
          <h2 className="modal-title">Notifications</h2>
          <div className="notification-header-actions">
            {unreadCount > 0 && (
              <>
                <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
                  <CheckIcon />
                  Mark All as Read
                </button>
                <span className="unread-count">{unreadCount} unread</span>
              </>
            )}
            <button className="modal-close-btn" onClick={handleClose}>
              <XIcon />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="notifications-tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`notification-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === 'All' && unreadCount > 0 && (
                <span className="tab-badge">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="modal-body notifications-modal-body">
          {filteredNotifications.length === 0 ? (
            <div className="no-notifications">
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-indicator"></div>
                  <div 
                    className="notification-icon" 
                    style={{ backgroundColor: notification.iconBg, color: notification.iconColor }}
                  >
                    {getIcon(notification.icon)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title-row">
                      <h3 className="notification-title">{notification.title}</h3>
                      {notification.isNew && <span className="new-badge">New</span>}
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    <div className="notification-footer">
                      <span className="notification-type" style={{ color: getMetaColor(notification.type) }}>
                        ● {notification.type}
                      </span>
                      <span className="notification-timestamp">• {notification.timestamp}</span>
                    </div>
                  </div>
                  <button className="notification-menu-btn" onClick={(e) => e.stopPropagation()}>
                    <MoreVerticalIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getMetaColor = (type) => {
  switch (type) {
    case 'Report Update':
      return '#2e7d32';
    case 'System Alert':
      return '#f57f17';
    case 'Admin Alert':
      return '#1565c0';
    case 'Assignment':
      return '#f57f17';
    case 'Reminder':
      return '#ff6f00';
    case 'Announcement':
      return '#1565c0';
    default:
      return '#666666';
  }
};



export default NotificationsModal;