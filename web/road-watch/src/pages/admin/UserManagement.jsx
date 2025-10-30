// src/pages/admin/UserManagement.jsx
import React, { useState } from 'react';
import UserFilters from '../../components/users/UserFilters';
import UsersTable from '../../components/users/UsersTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import UserDetailsModal from '../../components/modal/UserDetailsModal';
import ConfirmationModal from '../../components/modal/ConfirmationModal';
import AddUserModal from '../../components/modal/AddUserModal';
import '../admin/styles/UserManagement.css';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // User Details Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Confirmation Modal states
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: '', // 'suspend', 'activate', 'revoke'
    userId: null,
    userName: ''
  });

  // Mock data
  const users = [
    { id: 'U-1001', fullName: 'John Dela Cruz', role: 'Citizen', email: 'john.delacruz@citizen.com', dateRegistered: 'Oct 1, 2025', status: 'Active' },
    { id: 'U-1002', fullName: 'Maria Santos', role: 'Citizen', email: 'maria.santos@citizen.com', dateRegistered: 'Oct 3, 2025', status: 'Active' },
    { id: 'U-1003', fullName: 'Kyle Sumucad', role: 'Moderator', email: 'kyle.sumucad@roadwatch.gov', dateRegistered: 'Oct 5, 2025', status: 'Active' },
    { id: 'U-1004', fullName: 'Gab Saniel', role: 'Citizen', email: 'gab.saniel@citizen.com', dateRegistered: 'Oct 7, 2025', status: 'Suspended' },
    { id: 'U-1005', fullName: 'Adrian Lopez', role: 'Admin', email: 'adrian.lopez@roadwatch.gov', dateRegistered: 'Oct 10, 2025', status: 'Active' },
    { id: 'U-1006', fullName: 'Janine Cruz', role: 'Citizen', email: 'janine.cruz@citizen.com', dateRegistered: 'Oct 12, 2025', status: 'Active' },
    { id: 'U-1007', fullName: 'Robert Tan', role: 'Moderator', email: 'robert.tan@roadwatch.gov', dateRegistered: 'Oct 14, 2025', status: 'Active' },
    { id: 'U-1008', fullName: 'Nina Velasquez', role: 'Citizen', email: 'nina.velasquez@citizen.com', dateRegistered: 'Oct 17, 2025', status: 'Active' },
  ];

  const handleView = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSuspend = (userId) => {
    const user = users.find(u => u.id === userId);
    setConfirmationModal({
      isOpen: true,
      type: 'suspend',
      userId: userId,
      userName: user.fullName
    });
  };

  const handleActivate = (userId) => {
    const user = users.find(u => u.id === userId);
    setConfirmationModal({
      isOpen: true,
      type: 'activate',
      userId: userId,
      userName: user.fullName
    });
  };

  const handleRevoke = (userId) => {
    const user = users.find(u => u.id === userId);
    setConfirmationModal({
      isOpen: true,
      type: 'revoke',
      userId: userId,
      userName: user.fullName
    });
  };

  const handleConfirmAction = () => {
    const { type, userId } = confirmationModal;
    
    switch (type) {
      case 'suspend':
        console.log('Suspending user:', userId);
        // Add your suspend logic here
        break;
      case 'activate':
        console.log('Activating user:', userId);
        // Add your activate logic here
        break;
      case 'revoke':
        console.log('Revoking user:', userId);
        // Add your revoke logic here
        break;
      default:
        break;
    }

    // Close confirmation modal
    setConfirmationModal({
      isOpen: false,
      type: '',
      userId: null,
      userName: ''
    });
  };

  const handleCloseConfirmation = () => {
    setConfirmationModal({
      isOpen: false,
      type: '',
      userId: null,
      userName: ''
    });
  };

  const handleAddUser = () => {
  setIsAddUserModalOpen(true);
  };
  
  const handleCloseAddUserModal = () => {
  setIsAddUserModalOpen(false);
  };

  const handleSaveNewUser = (newUser) => {
    console.log('New user:', newUser);
    // Add your logic to save the new user
    setIsAddUserModalOpen(false);
  };

  const handleExportUsers = () => {
    console.log('Export users');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = (updatedUser) => {
    console.log('Save user:', updatedUser);
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Get modal content based on type
  const getConfirmationContent = () => {
    const { type, userName } = confirmationModal;
    
    switch (type) {
      case 'suspend':
        return {
          title: 'Suspend User?',
          message: `Are you sure you want to suspend ${userName}? This action can be reversed later.`,
          confirmText: 'Suspend User',
          type: 'warning'
        };
      case 'activate':
        return {
          title: 'Activate User?',
          message: `Are you sure you want to activate ${userName}? This will restore their access to the system.`,
          confirmText: 'Activate User',
          type: 'warning'
        };
      case 'revoke':
        return {
          title: 'Revoke Access?',
          message: `Are you sure you want to revoke access for ${userName}? This will suspend their administrative privileges.`,
          confirmText: 'Revoke Access',
          type: 'warning'
        };
      default:
        return {
          title: '',
          message: '',
          confirmText: '',
          type: 'warning'
        };
    }
  };

  const confirmationContent = getConfirmationContent();

  return (
    <div className="user-management-container">
      
      <UserFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onAddUser={handleAddUser}
        onExportUsers={handleExportUsers}
      />

      <UsersTable
        users={users}
        onView={handleView}
        onEdit={handleEdit}
        onSuspend={handleSuspend}
        onActivate={handleActivate}
        onRevoke={handleRevoke}
      />

      <ReportsPagination
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        currentPage={1}
        totalPages={1}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        mode={modalMode}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmAction}
        title={confirmationContent.title}
        message={confirmationContent.message}
        confirmText={confirmationContent.confirmText}
        type={confirmationContent.type}
      />
      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={handleCloseAddUserModal}
        onSave={handleSaveNewUser}
      />
    </div>
  );
};

export default UserManagement;