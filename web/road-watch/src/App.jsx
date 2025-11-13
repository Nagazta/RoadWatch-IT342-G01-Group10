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

//LANDING PAGES
import Mainpage from './pages/Landingpage/Mainpage';
import Loginpage from './pages/Landingpage/Loginpage';
import Registrationpage from './pages/Landingpage/Registrationpage';

//OTHER PAGES
import Featurespage from './pages/Features/Featurespage';
import HowItWorkspage from './pages/HowItWorks/HowItWorkspage';
import Contactpage from './pages/Contact/Contactpage';
import FAQpage from './pages/Support/FAQpage';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';
import AboutUspage from './pages/AboutUs/AboutUspage.jsx';

//AUTH CALLBACK
import CallbackPage from './pages/auth/CallbackPage';

//CITIZEN PAGES
import CitizenLayout from './components/layout/CitizenLayout';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import CitizenReports from './pages/citizen/CitizenReports';

//INSPECTOR PAGES
import InspectorLayout from './components/layout/InspectorLayout';
import InspectorDashboard from './pages/inspector/InspectorDashboard';
import SearchReports from './pages/inspector/SearchReports';
import AssignedReports from './pages/inspector/AssignedReports';
import CreateReport from './pages/inspector/CreateReport';
import InspectorSettings from './pages/inspector/Settings';
import ReportDetail from './pages/inspector/ReportDetail';

function App() { 
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to landing page */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        {/* Landing Page */}
        <Route path="/landing" element={<Mainpage />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registrationpage />} />
        <Route path="/auth/callback" element={<CallbackPage />} />

        {/* Public Pages - Navbar Links */}
        <Route path="/features" element={<Featurespage />} />
        <Route path="/how-it-works" element={<HowItWorkspage />} />
        <Route path="/about-us" element={<AboutUspage />} />
        <Route path="/contact" element={<Contactpage />} />

        {/* Public Pages - Footer Links */}
        <Route path="/faq" element={<FAQpage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Citizen Routes ⭐ ADD THIS */}
        <Route
          path="citizen/dashboard"
          element=
          {
            <CitizenLayout activeMenuItem="dashboard" pageTitle="Citizen Dashboard">
                 <CitizenDashboard />
            </CitizenLayout>
          }
        />

        <Route
          path="citizen/reports"
          element=
          {
            <CitizenLayout activeMenuItem="reports" pageTitle="My Reports">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                 <CitizenReports />
              </div>
            </CitizenLayout>
          }
         />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout activeMenuItem="dashboard" pageTitle="Dashboard Overview">
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminLayout activeMenuItem="reports" pageTitle="Reports Management">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <ReportsManagement />
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminLayout activeMenuItem="users" pageTitle="User Management">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <UserManagement />
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="/admin/audit"
          element={
            <AdminLayout activeMenuItem="audit" pageTitle="Audit Logs">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <AuditLogs />
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminLayout activeMenuItem="settings" pageTitle="System Settings">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <SystemSettings />
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="/admin/support"
          element={
            <AdminLayout activeMenuItem="support" pageTitle="Feedback & Support">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <FeedbackSupport />
              </div>
            </AdminLayout>
          }
        />
        <Route
          path="/admin/assign-inspectors"
          element={
            <AdminLayout activeMenuItem="assign_inspector" pageTitle="Assign Inspectors">
              <div style={{ padding: '24px', marginLeft: '250px' }}>
                <AssignInspector />
              </div>
            </AdminLayout>
          }
        />

        {/* Inspector Routes - Add your inspector routes here */}
        <Route
          path="inspector/dashboard"
          element={
            <InspectorLayout activeMenuItem="dashboard" pageTitle="Inspector Dashboard">
              <InspectorDashboard />
            </InspectorLayout>
          }
        />
        <Route
          path="inspector/search-reports"
          element={
            <InspectorLayout activeMenuItem="search_reports" pageTitle="Search Reports">
              <SearchReports />
            </InspectorLayout>
          }
        />
        <Route
          path="inspector/assigned-reports"
          element={
            <InspectorLayout activeMenuItem="assigned_reports" pageTitle="Assigned Reports">
              <AssignedReports />
            </InspectorLayout>
          }
        />
        <Route
          path="inspector/create-report"
          element={
            <InspectorLayout activeMenuItem="create_report" pageTitle="Create Report">
              <CreateReport />
            </InspectorLayout>
          }
        />
        <Route
          path="inspector/settings"
          element={
            <InspectorLayout activeMenuItem="settings" pageTitle="Settings">
              <InspectorSettings />
            </InspectorLayout>
          }
        />
        <Route
          path="inspector/reports/:reportId"
          element={
            <InspectorLayout activeMenuItem="assigned_reports" pageTitle="Report Detail">
              <ReportDetail />
            </InspectorLayout>
          }
        />
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;