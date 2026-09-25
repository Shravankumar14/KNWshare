import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2A2A2A] border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  // Unauthenticated users must be silently redirected to / (login page) with requested path saved
  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Role-based protection
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Student accounts cannot access /teacher/* routes — redirect to student dashboard
    if (user.role === 'student' || user.role !== 'teacher') {
      return <Navigate to="/dashboard" replace />;
    }
    // Teacher accounts cannot access /student/* routes — redirect to teacher dashboard
    if (user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
