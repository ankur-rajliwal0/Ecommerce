import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, profile } = useAuth();
  if (!user) return <Navigate to="/store-control/login" replace />;
  if (profile?.role !== 'admin') {
    return (
      <div className="container" style={{ padding: '40px 5%', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p style={{ marginBottom: '16px', marginTop: '16px' }}>You must be an administrator to view this page.</p>
        <p style={{ color: 'var(--text-muted)' }}>Note: For testing, you can change your 'role' to 'admin' in your Supabase 'profiles' table.</p>
        <div style={{ marginTop: '20px', padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', textAlign: 'left' }}>
          <strong>Debug Info:</strong><br />
          User ID: {user?.id}<br />
          Profile Data: {JSON.stringify(profile, null, 2)}
        </div>
      </div>
    );
  }
  
  return <Outlet />;
};

export default AdminRoute;
