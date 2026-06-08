import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Clock, Globe, Zap, ArrowLeft, BookOpen, MessageSquare, Shield } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { getReviews, createReview } from '../services/api';

export default function ProfilePage({ tutors, openBooking }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const tutorId = parseInt(id);
  const tutor = tutors.find(t => t.id === tutorId);

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (tutorId) {
      getReviews(tutorId).then(res => setReviews(res.data.data)).catch(() => {});
    }
  }, [tutorId]);

  if(!tutor) return (
    <div className="container" style={{paddingTop: 100, textAlign: 'center'}}>
      <h2 style={{color:'var(--danger)'}}>Tuteur introuvable.</h2>
      <button className="btn btn-primary" style={{marginTop:20}} onClick={()=>navigate('/')}>Retour à l'accueil</button>
    </div>
  );

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Vous devez être connecté pour laisser un avis', 'error');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await createReview({ tutor_id: tutorId, rating: reviewForm.rating, comment: reviewForm.comment });
      const newReview = res.data.data;
      
      // Update reviews list (replace if already exists from this user)
      setReviews(prev => {
        const filtered = prev.filter(r => r.user.id !== user.id);
        return [newReview, ...filtered];
      });
      
      showToast('Avis enregistré avec succès !', 'success');
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      showToast('Erreur lors de l\'enregistrement de l\'avis', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container animate-fade-up" style={{ padding: '40px 24px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ padding: 0, marginBottom: 24, paddingLeft: 0 }}>
        <ArrowLeft size={18} /> Retour à la liste
      </button>

      <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '32px' }}>
        <style>{`
          .profile-main { background: var(--bg-secondary); border-radius: var(--radius-lg); padding: 40px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); }
          .profile-sidebar { position: sticky; top: 100px; height: fit-content; }
          .booking-card { background: var(--bg-secondary); border-radius: var(--radius-lg); padding: 32px; box-shadow: var(--shadow-lg); border: 1px solid var(--border-light); }
          
          .profile-header-large { display: flex; gap: 32px; margin-bottom: 40px; align-items: center; }
          .profile-avatar-large { width: 140px; height: 140px; border-radius: 30px; object-fit: cover; box-shadow: var(--shadow-glow); }
          
          .p-name { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
          .p-stats { display: flex; gap: 16px; color: var(--text-secondary); margin-bottom: 16px; align-items: center; }
          
          .section-title { font-size: 20px; font-weight: 700; margin: 32px 0 16px; border-bottom: 2px solid var(--border-light); padding-bottom: 12px; display: flex; align-items: center; gap: 8px; }
          
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
          .info-block { background: var(--bg-primary); padding: 16px; border-radius: var(--radius-md); }
          .info-block h4 { color: var(--text-secondary); font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .info-block p { font-weight: 600; color: var(--text-primary); }

          .review-card { background: var(--bg-primary); padding: 16px; border-radius: var(--radius-md); margin-bottom: 12px; }
          .review-stars { color: #f59e0b; display: flex; gap: 2px; }
          
          @media(max-width: 992px){ 
            .profile-layout { grid-template-columns: 1fr; }
            .profile-sidebar { position: relative; top: 0; }
            .profile-header-large { flex-direction: column; text-align: center; }
            .p-stats { justify-content: center; }
          }
        `}</style>
        
        <div className="profile-main">
          <div className="profile-header-large">
            <img className="profile-avatar-large" src={'/' + tutor.avatar} alt={tutor.name} />
            <div>
              <div style={{display:'flex', alignItems:'center', gap: 12, marginBottom: 4}} >
                <h1 className="p-name">{tutor.name}</h1>
                <CheckCircle size={24} color="var(--success)" fill="var(--success-light)" />
              </div>
              <div className="p-stats">
                <div style={{display:'flex', alignItems:'center', gap: 6, color:'var(--warning)', fontWeight:600}}><Star size={18} fill="currentColor" /> {tutor.rating}</div>
                <div>•</div>
                <div style={{display:'flex', alignItems:'center', gap: 6}}><Clock size={16} /> {tutor.experience}</div>
                <div>•</div>
                <div style={{display:'flex', alignItems:'center', gap: 6}}><MapPin size={16} /> {tutor.city}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tutor.subjects.map(s => <span key={s} className="tag badge-success">{s}</span>)}
              </div>
            </div>
          </div>

          <h3 className="section-title"><BookOpen size={20} className="text-accent"/> À propos de {tutor.name.split(' ')[0]}</h3>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{tutor.bio}</p>

          <div className="info-grid">
            <div className="info-block">
              <h4>Niveau(x) enseigné(s)</h4>
              <p>{tutor.level}</p>
            </div>
            <div className="info-block">
              <h4>Méthodologie</h4>
              <p>{tutor.method}</p>
            </div>
            <div className="info-block">
              <h4>Formation</h4>
              <p>{tutor.education}</p>
            </div>
            <div className="info-block">
              <h4>Langues parlées</h4>
              <p style={{display:'flex', gap:8, alignItems:'center'}}><Globe size={16} color="var(--text-secondary)"/> {(tutor.languages||[]).join(', ')}</p>
            </div>
          </div>

          {/* Section Avis */}
          <h3 className="section-title" style={{ marginTop: 40 }}><Star size={20} className="text-warning"/> Avis des élèves ({reviews.length})</h3>
          
          {user && user.role !== 'admin' && (
            <form onSubmit={submitReview} style={{ background: 'var(--bg-primary)', padding: 20, borderRadius: 'var(--radius-md)', marginBottom: 24, border: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Laisser un avis</h4>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(num => (
                  <Star 
                    key={num} 
                    size={24} 
                    color={num <= reviewForm.rating ? '#f59e0b' : 'var(--text-secondary)'} 
                    fill={num <= reviewForm.rating ? '#f59e0b' : 'transparent'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                  />
                ))}
              </div>
              <textarea 
                className="form-input" 
                placeholder="Partagez votre expérience avec ce tuteur..." 
                rows="3" 
                value={reviewForm.comment}
                onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                style={{ marginBottom: 12 }}
              />
              <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                {submittingReview ? 'Envoi...' : 'Publier mon avis'}
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Aucun avis pour le moment.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600 }}>{review.user?.name || 'Élève'}</div>
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map(num => (
                        <Star key={num} size={14} fill={num <= review.rating ? "currentColor" : "transparent"} color={num <= review.rating ? "currentColor" : "var(--text-secondary)"} />
                      ))}
                    </div>
                  </div>
                  {review.comment && <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="profile-sidebar">
          <div className="booking-card">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>{tutor.price} <span style={{fontSize: 16, color: 'var(--text-secondary)', fontWeight: 500}}>MAD / h</span></div>
              <div style={{ color: 'var(--success)', fontSize: 14, fontWeight: 600, display: 'flex', justifyContent:'center', alignItems:'center', gap:6, marginTop:8 }}><Zap size={14} fill="currentColor"/> Réponse rapide</div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px', marginBottom: 12 }} onClick={() => openBooking(tutor.id)}>Demander une réservation</button>
            <button className="btn btn-outline" style={{ width: '100%', padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={() => navigate('/chat')}>
              <MessageSquare size={18} /> Envoyer un message
            </button>
            
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginTop: 20 }}>Vous ne serez pas débité avant l'acceptation par le tuteur.</p>
            
            <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 12, alignItems: 'center' }}>
              <Shield size={24} color="#10b981" />
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <strong>Profil vérifié.</strong> L'identité, les diplômes et l'expérience de ce tuteur ont été validés par l'équipe SoutienLocal.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
