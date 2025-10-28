import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

//ADMIN PAGES
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ReportsManagement from './pages/admin/ReportsManagement';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';
import SystemSettings from './pages/admin/SystemSettings';
import FeedbackSupport from './pages/admin/FeedbackSupport';
import AssignInspector from './pages/admin/AssignInspector';

//INSPECTOR PAGES
//Put your inspector imports here
//CITIZEN PAGES
//Put your citizen imports here

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
                <ReportsManagement />
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="admin/users"
          element={
            <AdminLayout activeMenuItem="users" pageTitle="User Management">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <UserManagement />
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="admin/audit"
          element={
            <AdminLayout activeMenuItem="audit" pageTitle="Audit Logs">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <AuditLogs />
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="admin/settings"
          element={
            <AdminLayout activeMenuItem="settings" pageTitle="System Settings">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <SystemSettings />
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="admin/support"
          element={
            <AdminLayout activeMenuItem="support" pageTitle="Feedback & Support">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <FeedbackSupport />
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="admin/assign-inspectors"
          element={
            <AdminLayout activeMenuItem="assign_inspector" pageTitle="Assign Inspectors">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <AssignInspector />
              </div>
            </AdminLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
