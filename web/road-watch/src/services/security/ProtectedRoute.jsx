import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const isAuthInProgress = sessionStorage.getItem("authInProgress");

  // Still logging in
  if (isAuthInProgress) return null;

  // Not logged in
  if (!token) {
    alert("You cannot access this page. Please log in first.");
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (allowedRoles.length && !allowedRoles.includes(userRole)) {
    alert("You do not have permission to access this page.");
    return <Navigate to="/landing" replace />;
  }

  return children;
};

export default ProtectedRoute;
