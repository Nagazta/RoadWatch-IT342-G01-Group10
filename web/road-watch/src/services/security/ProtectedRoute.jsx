import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const isAuthInProgress = sessionStorage.getItem("authInProgress");

  // Still logging in
  if (isAuthInProgress) return null;

  // Not logged in
  if (!token) {
      return <Navigate to="/unauthorizedUser" state={{ reason: "login_required" }} replace />;
  }

  // Role not allowed
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        if(userRole === 'Admin' && !UserRole === 'Inspector' || 'Citizen'){
            return <Navigate to="/unauthorizedUser" state={{ reason: "access_denied" }} replace />;
        }
        if(userRole === 'Inspector' && !UserRole === 'Admin' || 'Citizen'){
            return <Navigate to="/unauthorizedUser" state={{ reason: "access_denied" }} replace />;
        }
        if(userRole === 'Citizen' && !UserRole === 'Admin' || 'Inspector'){
            return <Navigate to="/unauthorizedUser" state={{ reason: "access_denied" }} replace />;
        }
        else {
            return null;
        }
    }

  return children;
};

export default ProtectedRoute;
