import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--bg-primary)',
      }}>
        <div style={{
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease',
        }}>
          <div style={{
            width: 48,
            height: 48,
            border: '4px solid var(--border-light)',
            borderTopColor: 'var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Chargement...</p>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          `}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
