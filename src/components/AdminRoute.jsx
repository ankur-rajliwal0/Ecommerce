import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, profile, loading } = useAuth();

  // Wait for auth & profile check to complete before deciding
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#344B38]/20 border-t-[#344B38] rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. If no one is logged in -> Open admin login page
  if (!user) {
    return <Navigate to="/store-control/login" replace />;
  }

  // 2. If user is logged in but NOT an admin -> Silently redirect to home page
  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. User is verified admin -> Grant access
  return <Outlet />;
};

export default AdminRoute;
