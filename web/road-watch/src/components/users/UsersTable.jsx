// src/components/users/UsersTable.jsx
import UsersTableHeader from './UsersTableHeader';
import UserTableRow from './UsersTableRow';
import '../reports/styles/ReportsTable.css';

const UsersTable = ({ users, onView, onEdit, onSuspend, onActivate, onRevoke }) => {
  return (
    <div className="table-container">
      <table className="reports-table">
        <UsersTableHeader />
        <tbody>
          {users.map((user, index) => (
            <UserTableRow
              key={`${user.id}-${index}`}
              user={user}
              onView={onView}
              onEdit={onEdit}
              onSuspend={onSuspend}
              onActivate={onActivate}
              onRevoke={onRevoke}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;