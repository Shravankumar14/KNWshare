import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw } from 'lucide-react';

export const RoleProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-knw-red animate-spin" />
        <p className="text-xs font-mono text-knw-muted">Verifying session permissions…</p>
      </div>
    );
  }

  // If page requires authentication and user is not logged in
  if (!isAuthenticated || !user) {
    // If accessing teacher portal, require login
    if (allowedRoles.includes('teacher') && !allowedRoles.includes('student')) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // For general routes, allow guest view
    return children;
  }

  // If user role is not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Teacher attempting to access student pages -> redirect to Teacher Dashboard
    if (user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    }
    // Student attempting to access teacher portal -> redirect to Student Home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
