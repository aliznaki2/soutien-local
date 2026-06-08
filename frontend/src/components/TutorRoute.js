import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function TutorRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', background: 'var(--bg-primary)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48,
            border: '4px solid var(--border-light)',
            borderTopColor: 'var(--accent-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: 'var(--text-secondary)' }}>Vérification des droits...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'tutor') {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '60vh', padding: 40,
      }}>
        <div style={{
          textAlign: 'center',
          background: 'var(--bg-secondary)',
          padding: '60px 40px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-light)',
          maxWidth: 440,
        }}>
          <div style={{
            width: 80, height: 80,
            background: '#fef3c7',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <ShieldAlert size={40} color="#f59e0b" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, color: 'var(--text-primary)' }}>
            Espace Tuteur
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6 }}>
            Cette section est réservée aux tuteurs de la plateforme.
            Inscrivez-vous en tant que tuteur pour accéder à cet espace.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
