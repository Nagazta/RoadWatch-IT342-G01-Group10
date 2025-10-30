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

import Mainpage from './pages/Landingpage/Mainpage';
import Loginpage from './pages/Landingpage/Loginpage';
import Registrationpage from './pages/Landingpage/Registrationpage';

//INSPECTOR PAGES
//Put your inspector imports here
import InspectorDashboard from './pages/inspector/InspectorDashboard';
import InspectorSearchReports from './pages/inspector/InspectorSearchReports';
import InspectorAssignedReports from './pages/inspector/InspectorAssignedReports';
import InspectorCreateReport from './pages/inspector/InspectorCreateReports';
import InspectorSettings from './pages/inspector/InspectorSettings';
//CITIZEN PAGES
//Put your citizen imports here

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to admin dashboard */}
        <Route path="/" element={<Navigate to="Landingpage/Mainpage" replace />} />

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
              path="Landingpage/Mainpage"
              element={
                  <Mainpage activeMenuItem="Mainpage" pageTitle="Mainpage Overview">
                      <Mainpage />
                  </Mainpage>
              }
          />

          <Route
              path="Landingpage/Loginpage"
              element={
                  <Loginpage activeMenuItem="Loginpage" pageTitle="Loginpage Overview">
                      <Loginpage />
                  </Loginpage>
              }
          />

          <Route
              path="Landingpage/Registrationpage"
              element={
                  <Registrationpage activeMenuItem="Registrationpage" pageTitle="Registrationpage Overview">
                      <Registrationpage />
                  </Registrationpage>
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
        {/* Inspector routes */}
          <Route
              path="i/d"
              element={
                  <InspectorDashboard activeMenuItem="dashboard" pageTitle="Mainpage Overview">
                      <InspectorDashboard />
                  </InspectorDashboard>
              }
          />
          <Route
              path="i/sr"
              element={
                  <InspectorSearchReports activeMenuItem="InspectorSearchReports" pageTitle="Mainpage Overview">
                      <InspectorSearchReports />
                  </InspectorSearchReports>
              }
          />
          <Route
              path="i/ar"
              element={
                  <InspectorAssignedReports activeMenuItem="InspectorAssignedReports" pageTitle="Mainpage Overview">
                      <InspectorAssignedReports />
                  </InspectorAssignedReports>
              }
          />
          <Route
              path="i/cr"
              element={
                  <InspectorCreateReport activeMenuItem="InspectorCreateReports" pageTitle="Mainpage Overview">
                      <InspectorCreateReport />
                  </InspectorCreateReport>
              }
          />
          <Route
              path="i/s"
              element={
                  <InspectorSettings activeMenuItem="InspectorSettings" pageTitle="Mainpage Overview">
                      <InspectorSettings />
                  </InspectorSettings>
              }
          />




      </Routes>
    </BrowserRouter>
  );
}

export default App;
