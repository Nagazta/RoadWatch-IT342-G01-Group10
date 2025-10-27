import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to admin dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Admin routes */}
        <Route
          path="admin/dashboard"
          element={
            <AdminLayout activeMenuItem="dashboard" pageTitle="Dashboard Overview">
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="admin/reports"
          element={
            <AdminLayout activeMenuItem="reports" pageTitle="Reports Management">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <h1>Reports Management</h1>
                <p>Reports management page coming soon...</p>
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="admin/users"
          element={
            <AdminLayout activeMenuItem="users" pageTitle="User Management">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <h1>User Management</h1>
                <p>User management page coming soon...</p>
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="admin/audit"
          element={
            <AdminLayout activeMenuItem="audit" pageTitle="Audit Logs">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <h1>Audit Logs</h1>
                <p>Audit logs page coming soon...</p>
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="admin/settings"
          element={
            <AdminLayout activeMenuItem="settings" pageTitle="System Settings">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <h1>System Settings</h1>
                <p>System settings page coming soon...</p>
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="admin/support"
          element={
            <AdminLayout activeMenuItem="support" pageTitle="Feedback & Support">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <h1>Feedback & Support</h1>
                <p>Feedback & support page coming soon...</p>
              </div>
            </AdminLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
