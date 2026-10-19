import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false, moderatorOnly = false }) {
  const { user, loading, isAuthenticated, isAdmin, isModerator } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#FF9933] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (moderatorOnly && !isModerator) {
    return <Navigate to="/" replace />;
  }

  return children;
}
