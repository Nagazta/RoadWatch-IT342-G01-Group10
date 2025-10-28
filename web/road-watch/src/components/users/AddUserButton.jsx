// src/components/users/AddUserButton.jsx
import React from 'react';
import { UserPlusIcon } from '../common/Icons';
import '../users/styles/AddUserButton.css';

const AddUserButton = ({ onClick }) => {
  return (
    <button className="add-user-btn" onClick={onClick}>
      <UserPlusIcon />
      <span>Add New User</span>
    </button>
  );
};

export default AddUserButton;