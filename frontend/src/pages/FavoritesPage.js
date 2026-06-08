import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Trash2, BookOpen, Star, MapPin } from 'lucide-react';

export default function FavoritesPage({ tutors, favorites, toggleFavorite, openBooking }) {
  const navigate = useNavigate();
  const favTutors = tutors.filter(t => favorites.includes(t.id));

  return (
    <div className="container animate-fade-up" style={{ padding: '32px 24px', maxWidth: 900 }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ padding: 0, marginBottom: 16 }}>
        <ArrowLeft size={18} /> Retour
      </button>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>❤️ Mes Favoris</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>{favTutors.length} tuteur{favTutors.length !== 1 ? 's' : ''} sauvegardé{favTutors.length !== 1 ? 's' : ''}</p>

      {favTutors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💔</div>
          <h3 style={{ marginBottom: 8, fontWeight: 700 }}>Aucun favori pour le moment</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Explorez nos tuteurs et ajoutez-les à vos favoris !</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Explorer les tuteurs</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {favTutors.map(t => {
            const subjects = Array.isArray(t.subjects) ? t.subjects : JSON.parse(t.subjects || '[]');
            return (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 20, padding: 20,
                background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s', cursor: 'pointer',
              }} onClick={() => navigate(`/profile/${t.id}`)}>
                <img src={'/' + t.avatar} alt={t.name} style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                    {subjects.map(s => <span key={s} className="tag" style={{ fontSize: 11 }}>{s}</span>)}
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13}/> {t.city}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b' }}><Star size={13} fill="currentColor"/> {t.rating}</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{t.price} MAD/h</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={(e) => { e.stopPropagation(); openBooking(t.id); }}>
                    <BookOpen size={14}/> Réserver
                  </button>
                  <button className="btn btn-outline" style={{ padding: '8px 12px', color: '#ef4444', borderColor: '#fca5a5' }} onClick={(e) => { e.stopPropagation(); toggleFavorite(t.id); }}>
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
