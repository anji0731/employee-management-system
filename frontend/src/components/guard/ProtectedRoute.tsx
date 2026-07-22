import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredPermission }) => {
  const { isAuthenticated, isLoading, hasPermission, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Validating security credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Force redirect if using temporary password
  const isTempPassword = user?.first_login || user?.is_temporary_password;
  const isCurrentlyOnChangePassword = window.location.pathname === '/change-password';

  if (isTempPassword && !isCurrentlyOnChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  if (!isTempPassword && isCurrentlyOnChangePassword) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
