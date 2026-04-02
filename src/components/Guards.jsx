import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

/**
 * ProtectedRoute: Ensures user is authenticated
 */
export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * RoleGuard: Ensures authenticated user has required role
 */
export const RoleGuard = ({ children, allowedRoles }) => {
  const user = useAuthStore((state) => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized or dashboard based on role
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
