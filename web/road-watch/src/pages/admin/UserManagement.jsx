// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import UserFilters from '../../components/users/UserFilters';
import UsersTable from '../../components/users/UsersTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import UserDetailsModal from '../../components/modal/UserDetailsModal';
import ConfirmationModal from '../../components/modal/ConfirmationModal';
import AddUserModal from '../../components/modal/AddUserModal';
import '../admin/styles/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: '',
    userId: null,
    userName: ''
  });

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/users/getAll');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      // Map backend fields to frontend table fields
      const mappedUsers = data.map(user => ({
        id: user.id,
        fullName: user.name,  // backend 'name'
        email: user.email,
        role: user.role,
        dateRegistered: new Date(user.createdAt).toLocaleDateString(), // format LocalDateTime
        status: user.isActive ? 'Active' : 'Suspended' // convert boolean to string
      }));

      setUsers(mappedUsers);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message);
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  // User Actions
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
      userId,
      userName: user.name
    });
  };

  const handleActivate = (userId) => {
    const user = users.find(u => u.id === userId);
    setConfirmationModal({
      isOpen: true,
      type: 'activate',
      userId,
      userName: user.name
    });
  };

  const handleRevoke = (userId) => {
    const user = users.find(u => u.id === userId);
    setConfirmationModal({
      isOpen: true,
      type: 'revoke',
      userId,
      userName: user.name
    });
  };

  const handleConfirmAction = async () => {
    const { type, userId } = confirmationModal;
    try {
      switch (type) {
        case 'suspend':
          await fetch(`http://localhost:8080/api/users/updateBy/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'SUSPENDED' })
          });
          break;
        case 'activate':
          await fetch(`http://localhost:8080/api/users/updateBy/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'ACTIVE' })
          });
          break;
        case 'revoke':
          console.log('Revoke not implemented yet');
          break;
        default:
          break;
      }
      await fetchUsers(); // refresh table
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setConfirmationModal({ isOpen: false, type: '', userId: null, userName: '' });
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationModal({ isOpen: false, type: '', userId: null, userName: '' });
  };

  const handleAddUser = () => setIsAddUserModalOpen(true);
  const handleCloseAddUserModal = () => setIsAddUserModalOpen(false);

  // Add User
  const handleSaveNewUser = async (newUser) => {
    try {
      const payload = {
        username: newUser.email.split('@')[0],
        name: newUser.name || newUser.fullName,
        email: newUser.email,
        contact: newUser.contactNumber,
        role: newUser.role.toUpperCase(),
        password: newUser.password
      };

      const response = await fetch('http://localhost:8080/api/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Failed to create user');

      await fetchUsers(); // refresh table
      setIsAddUserModalOpen(false);
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      const payload = { ...updatedUser }; // modify fields as needed
      await fetch(`http://localhost:8080/api/users/updateBy/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      await fetchUsers(); // refresh table
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const getConfirmationContent = () => {
    const { type, userName } = confirmationModal;
    switch (type) {
      case 'suspend':
        return { title: 'Suspend User?', message: `Suspend ${userName}?`, confirmText: 'Suspend', type: 'warning' };
      case 'activate':
        return { title: 'Activate User?', message: `Activate ${userName}?`, confirmText: 'Activate', type: 'warning' };
      case 'revoke':
        return { title: 'Revoke Access?', message: `Revoke ${userName}?`, confirmText: 'Revoke', type: 'warning' };
      default:
        return { title: '', message: '', confirmText: '', type: 'warning' };
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
        onExportUsers={() => console.log('Export')}
      />

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <UsersTable
          users={users}
          onView={handleView}
          onEdit={handleEdit}
          onSuspend={handleSuspend}
          onActivate={handleActivate}
          onRevoke={handleRevoke}
        />
      )}

      <ReportsPagination
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        currentPage={1}
        totalPages={1}
      />

      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        mode={modalMode}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmAction}
        title={confirmationContent.title}
        message={confirmationContent.message}
        confirmText={confirmationContent.confirmText}
        type={confirmationContent.type}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={handleCloseAddUserModal}
        onSave={handleSaveNewUser}
      />
    </div>
  );
};

export default UserManagement;
