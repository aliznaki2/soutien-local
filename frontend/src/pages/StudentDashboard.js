import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CheckCircle, TrendingUp, BookOpen, MapPin, Star, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getStudentStats } from '../services/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentStats()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpis = [
    { label: 'Réservations', value: stats?.total_bookings || 0, icon: <Calendar size={22}/>, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Confirmées', value: stats?.confirmed || 0, icon: <CheckCircle size={22}/>, color: '#10b981', bg: '#d1fae5' },
    { label: 'En attente', value: stats?.pending || 0, icon: <Clock size={22}/>, color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Dépenses (MAD)', value: stats?.total_spent || 0, icon: <TrendingUp size={22}/>, color: '#8b5cf6', bg: '#ede9fe' },
  ];

  return (
    <div className="container animate-fade-up" style={{ padding: '32px 24px', maxWidth: 900 }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ padding: 0, marginBottom: 16 }}>
        <ArrowLeft size={18} /> Retour
      </button>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>📊 Mon Tableau de bord</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Bienvenue, {user?.name?.split(' ')[0] || 'Élève'} ! Voici vos statistiques.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>Chargement...</div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
            {kpis.map((k, i) => (
              <div key={i} style={{
                background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
                padding: 24, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color, marginBottom: 14 }}>
                  {k.icon}
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>{k.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginTop: 2 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Prochaine séance */}
          {stats?.next_booking && (
            <div style={{
              background: 'linear-gradient(135deg, var(--accent-primary), #4f46e5)',
              borderRadius: 'var(--radius-lg)', padding: 28, marginBottom: 24, color: 'white',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.8, marginBottom: 12 }}>🎯 PROCHAINE SÉANCE</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{stats.next_booking.tutor?.name || 'Tuteur'}</div>
                  <div style={{ display: 'flex', gap: 16, opacity: 0.9, fontSize: 14 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={14}/> {new Date(stats.next_booking.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                    {stats.next_booking.time && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14}/> {stats.next_booking.time}</span>}
                  </div>
                </div>
                <button onClick={() => navigate('/my-bookings')} style={{
                  background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white', padding: '10px 20px', borderRadius: 'var(--radius-full)',
                  cursor: 'pointer', fontWeight: 600, fontSize: 13,
                }}>Voir détails</button>
              </div>
            </div>
          )}

          {/* Tuteurs récents */}
          {stats?.recent_tutors?.length > 0 && (
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={18} color="var(--accent-primary)"/> Tuteurs récents
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {stats.recent_tutors.map(t => (
                  <div key={t.id} onClick={() => navigate(`/profile/${t.id}`)} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: 14,
                    background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,var(--accent-primary),#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                      {t.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={10}/> {t.city}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions rapides */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={16}/> Trouver un tuteur
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/my-bookings')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={16}/> Mes réservations
            </button>
          </div>
        </>
      )}
    </div>
  );
}
