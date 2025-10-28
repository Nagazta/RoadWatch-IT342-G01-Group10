import React, { useState } from 'react';
import UserFilters from '../../components/users/UserFilters';
import UsersTable from '../../components/users/UsersTable';
import ReportsPagination from '../../components/reports/ReportsPagination';
import './UserManagement.css';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    console.log('View user:', userId);
  };

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
  };

  const handleSuspend = (userId) => {
    console.log('Suspend user:', userId);
  };

  const handleActivate = (userId) => {
    console.log('Activate user:', userId);
  };

  const handleRevoke = (userId) => {
    console.log('Revoke user:', userId);
  };

  const handleAddUser = () => {
    console.log('Add new user');
  };

  const handleExportUsers = () => {
    console.log('Export users');
  };

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
    </div>
  );
};

export default UserManagement;