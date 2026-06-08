import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, GraduationCap, ChevronRight, Heart } from 'lucide-react';
import './TutorCard.css';

export default function TutorCard({ t, index, onBook, isFavorite, onToggleFavorite }) {
  const delayStyle = {
    animationDelay: `${(index % 10) * 100}ms`
  };

  return (
    <article className="tutor-card animate-fade-up" style={{ opacity: 0, ...delayStyle }}>

      {/* ── EN-TÊTE : avatar + infos + prix + cœur ── */}
      <div className="tutor-header">
        <img className="tutor-avatar" src={t.avatar} alt={t.name} />

        <div className="tutor-info">
          <h3 className="tutor-name">{t.name}</h3>
          <div className="tutor-rating">
            <Star size={15} fill="currentColor" /> {t.rating}
          </div>
          <div className="tutor-location">
            <MapPin size={13} /> {t.city}
          </div>
        </div>

        {/* Prix + bouton favori alignés à droite */}
        <div className="tutor-header-right">
          <span className="tutor-pricing">{t.price} MAD/h</span>
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={onToggleFavorite}
            aria-label="Favoris"
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* ── BIO ── */}
      <p className="tutor-bio">{t.bio}</p>

      {/* ── TAGS ── */}
      <div className="tutor-tags">
        <span className="tag">
          <GraduationCap size={13} style={{ marginRight: 4 }} /> {t.level}
        </span>
        {t.subjects.slice(0, 2).map(s => (
          <span key={s} className="tag badge-success">{s}</span>
        ))}
        {t.subjects.length > 2 && (
          <span className="tag tag-more">+{t.subjects.length - 2}</span>
        )}
      </div>

      {/* ── ACTIONS ── */}
      <div className="tutor-actions">
        <Link
          to={`/profile/${t.id}`}
          className="btn btn-outline"
          style={{ padding: '9px', fontSize: '14px' }}
        >
          Voir Profil
        </Link>
        <button
          className="btn btn-primary"
          style={{ padding: '9px', fontSize: '14px' }}
          onClick={() => onBook(t.id)}
        >
          Réserver <ChevronRight size={16} />
        </button>
      </div>

    </article>
  );
}
