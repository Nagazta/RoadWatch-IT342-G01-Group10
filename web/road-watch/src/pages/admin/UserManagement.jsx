// src/pages/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import UserFilters from '../../components/users/UserFilters';
import UsersTable from '../../components/users/UsersTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import UserDetailsModal from '../../components/modal/UserDetailsModal';
import ConfirmationModal from '../../components/modal/ConfirmationModal';
import AddUserModal from '../../components/modal/AddUserModal';
import '../admin/styles/UserManagement.css';

const baseUrl = `${import.meta.env.VITE_API_URL}/api`;
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

  // ✅ Get admin ID from localStorage
  const getAdminId = () => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    console.log('🔍 getAdminId Debug:');
    console.log('  - Raw userId from localStorage:', userId);
    console.log('  - Raw userRole from localStorage:', userRole);
    console.log('  - userRole type:', typeof userRole);
    console.log('  - userId type:', typeof userId);
    console.log('  - Is ADMIN?', userRole === 'ADMIN');
    console.log('  - Has userId?', !!userId);

    // Only return userId if the current user is an ADMIN
    if (userRole === 'ADMIN' && userId) {
      const parsedId = parseInt(userId, 10);
      console.log('  ✅ Returning admin ID:', parsedId);
      return parsedId;
    }
    console.log('  ❌ Returning null (not an admin or no userId)');
    return null;
  };

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/users/getAll`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      // Map backend fields to frontend table fields
      const mappedUsers = data.map(user => ({
        id: user.id,
        fullName: user.name,
        email: user.email,
        role: user.role,
        dateRegistered: new Date(user.createdAt).toLocaleDateString(),
        status: user.isActive ? 'Active' : 'Suspended'
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
      userName: user.fullName
    });
  };

  const handleActivate = (userId) => {
    const user = users.find(u => u.id === userId);
    setConfirmationModal({
      isOpen: true,
      type: 'activate',
      userId,
      userName: user.fullName
    });
  };

  const handleRevoke = (userId) => {
    const user = users.find(u => u.id === userId);
    setConfirmationModal({
      isOpen: true,
      type: 'revoke',
      userId,
      userName: user.fullName
    });
  };

  const handleConfirmAction = async () => {
    const { type, userId } = confirmationModal;

    console.log('====================================');
    console.log('🚀 handleConfirmAction called');
    console.log('Type:', type);
    console.log('User ID:', userId);
    console.log('====================================');

    const token = localStorage.getItem('token');

    if (!token) {
      alert('You are not authenticated. Please login again.');
      return;
    }

    try {
      let payload;
      let url;
      let method;

      switch (type) {
        case 'suspend':
          payload = { isActive: false };
          url = `http://localhost:8080/api/users/updateBy/${userId}`;
          method = 'PUT';
          console.log('📤 SUSPEND - Sending payload:', JSON.stringify(payload));
          break;

        case 'activate':
          payload = { isActive: true };
          url = `http://localhost:8080/api/users/updateBy/${userId}`;
          method = 'PUT';
          console.log('📤 ACTIVATE - Sending payload:', JSON.stringify(payload));
          break;

        case 'revoke':
          url = `http://localhost:8080/api/users/deleteBy/${userId}`;
          method = 'DELETE';
          console.log('📤 REVOKE - Deleting user');
          break;

        default:
          console.error('❌ Unknown action type:', type);
          return;
      }

      console.log('📡 Making request to:', url);
      console.log('📡 Method:', method);
      console.log('📡 Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.substring(0, 20)}...`
      });

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: payload ? JSON.stringify(payload) : undefined
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      const responseText = await response.text();
      console.log('📥 Response body (raw):', responseText);

      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : null;
        console.log('📥 Response data (parsed):', responseData);
      } catch (e) {
        console.log('⚠️ Response is not JSON');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      console.log('✅ Action completed successfully');
      await fetchUsers(); // refresh table

    } catch (err) {
      console.error('❌ Action failed:', err);
      console.error('❌ Error stack:', err.stack);
      alert(`Failed to ${type} user: ${err.message}`);
    } finally {
      setConfirmationModal({ isOpen: false, type: '', userId: null, userName: '' });
    }
  };
  const handleCloseConfirmation = () => {
    setConfirmationModal({ isOpen: false, type: '', userId: null, userName: '' });
  };

  const handleAddUser = () => setIsAddUserModalOpen(true);
  const handleCloseAddUserModal = () => setIsAddUserModalOpen(false);

  // ✅ Add User with Admin ID
  const handleSaveNewUser = async (newUser) => {
    console.log('====================================');
    console.log('🚀 handleSaveNewUser called');
    console.log('====================================');

    try {
      const adminId = getAdminId(); // Get logged-in admin's ID

      console.log('📦 New User Data:', newUser);
      console.log('👤 Admin ID:', adminId);

      const payload = {
        username: newUser.email.split('@')[0],
        name: newUser.name || newUser.fullName,
        email: newUser.email,
        contact: newUser.contactNumber,
        role: newUser.role.toUpperCase(),
        password: newUser.password,
        assignedArea: newUser.assignedArea,
        createdByAdminId: adminId
      };

      console.log('📤 FINAL PAYLOAD TO BACKEND:');
      console.log(JSON.stringify(payload, null, 2));
      console.log('====================================');

      const response = await fetch('http://localhost:8080/api/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('📥 Response status:', response.status);

      const data = await response.json();
      console.log('📥 Response data:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create user');
      }

      console.log('✅ User created successfully!');
      await fetchUsers(); // refresh table
      setIsAddUserModalOpen(false);
    } catch (err) {
      console.error('❌ Error creating user:', err);
      console.error('❌ Error details:', err.message);
      alert(`Failed to create user: ${err.message}`);
    }
  };

  const handleSaveUser = async (updatedUser) => {
    const token = localStorage.getItem('token');

    console.log('====================================');
    console.log('💾 handleSaveUser called');
    console.log('Updated user data from modal:', updatedUser);
    console.log('====================================');

    try {
      // ✅ Only send the fields that the modal provides
      const payload = {
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        isActive: updatedUser.isActive
      };

      console.log('📤 Payload to backend:', JSON.stringify(payload, null, 2));

      const response = await fetch(`http://localhost:8080/api/users/updateBy/${updatedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      console.log('📥 Response status:', response.status);
      console.log('📥 Response body:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      console.log('✅ User updated successfully');
      console.log('====================================');

      await fetchUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('❌ Error updating user:', err);
      alert(`Failed to update user: ${err.message}`);
    }
  };

  const getConfirmationContent = () => {
    const { type, userName } = confirmationModal;
    switch (type) {
      case 'suspend':
        return {
          title: 'Suspend User?',
          message: `Are you sure you want to suspend ${userName}?`,
          confirmText: 'Suspend',
          type: 'warning'
        };
      case 'activate':
        return {
          title: 'Activate User?',
          message: `Are you sure you want to activate ${userName}?`,
          confirmText: 'Activate',
          type: 'warning'
        };
      case 'revoke':
        return {
          title: 'Revoke Access?',
          message: `Are you sure you want to permanently delete ${userName}?`,
          confirmText: 'Revoke',
          type: 'danger'
        };
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