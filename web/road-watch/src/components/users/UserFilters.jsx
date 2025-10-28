import React from 'react';
import SearchBar from '../reports/SearchBar';
import RoleFilter from './RoleFilter';
import UserStatusFilter from './UserStatusFilter';
import AddUserButton from './AddUserButton';
import ExportUsersButton from './ExportUsersButton';
import '../users/styles/UserFilter.css';

const UserFilters = ({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  onAddUser,
  onExportUsers
}) => {
  return (
    <div className="user-filters-section">
      <div className="user-filters-left">
        <SearchBar 
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by name, email, or user ID..."
        />
        <RoleFilter 
          value={selectedRole}
          onChange={onRoleChange}
        />
        <UserStatusFilter 
          value={selectedStatus}
          onChange={onStatusChange}
        />
      </div>

      <div className="user-filters-right">
        <AddUserButton onClick={onAddUser} />
        <ExportUsersButton onClick={onExportUsers} />
      </div>
    </div>
  );
};

export default UserFilters;