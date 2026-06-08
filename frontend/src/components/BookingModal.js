import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, X, BookOpen, CheckCircle, Loader } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/api';

export default function BookingModal({ visible, tutor, onClose, onConfirm }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => { 
    if(visible) { 
      setDate(''); setTime(''); setSubject(''); setNotes(''); 
      setSuccess(false); setLoading(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [visible]);

  if(!visible || !tutor) return null;

  const subjects = Array.isArray(tutor.subjects) ? tutor.subjects : JSON.parse(tutor.subjects || '[]');

  // Calculer la date minimale (demain)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  async function submit(e) { 
    e.preventDefault(); 
    if(!date || !time) { 
      showToast('Merci de renseigner la date et l\'heure.', 'error'); 
      return; 
    }

    setLoading(true);
    try {
      await createBooking({
        tutor_id: tutor.id,
        date,
        time,
        subject: subject || subjects[0] || '',
        message: notes,
      });
      setSuccess(true);
      showToast(`Réservation enregistrée pour ${tutor.name} !`, 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.date?.[0] || 'Erreur lors de la réservation';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop-premium" style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <style>{`
        .modal-backdrop-premium { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); animation: fadeIn 0.3s ease; }
        .modal-premium { background: var(--bg-secondary); width: 100%; max-width: 550px; border-radius: var(--radius-lg); padding: 32px; box-shadow: 0 40px 80px rgba(0,0,0,0.2); position: relative; animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .close-btn { position: absolute; right: 24px; top: 24px; background: var(--bg-primary); border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text-secondary); transition: var(--transition); }
        .close-btn:hover { background: var(--danger); color: white; transform: rotate(90deg); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        
        .success-anim { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.5); } to { opacity:1; transform:scale(1); } }
      `}</style>

      <div className="modal-premium">
        <button onClick={onClose} className="close-btn" aria-label="Fermer"><X size={18} /></button>
        
        {/* === ÉCRAN DE SUCCÈS === */}
        {success ? (
          <div className="success-anim" style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 80, height: 80,
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <CheckCircle size={40} color="#10b981" />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Réservation confirmée !</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
              Votre demande de cours avec <strong>{tutor.name}</strong> a été enregistrée.<br/>
              Le tuteur sera notifié et confirmera votre séance.
            </p>
            
            <div style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: 20,
              marginBottom: 24,
              textAlign: 'left',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>📅 Date</div>
                  <div style={{ fontWeight: 600 }}>{new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>🕐 Heure</div>
                  <div style={{ fontWeight: 600 }}>{time}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>📚 Matière</div>
                  <div style={{ fontWeight: 600 }}>{subject || subjects[0] || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>💰 Tarif</div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{tutor.price} MAD / h</div>
                </div>                                                  
              </div>
            </div>

            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              fontSize: 13,
              color: '#1e40af',
              marginBottom: 24,
              textAlign: 'left',
            }}>
              ℹ️ Statut : <strong>En attente de confirmation</strong> — Le tuteur confirmera dans les prochaines 24h.
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: 14, fontSize: 16 }} onClick={onClose}>
              Fermer
            </button>
          </div>
        ) : (
          /* === FORMULAIRE === */
          <>
            <h2 style={{ fontSize: 24, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <BookOpen size={22} color="var(--accent-primary)" /> Réserver une séance
            </h2>
            
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: 24 }}>
              <img src={'/' + tutor.avatar} alt={tutor.name} style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover' }} />
              <div>
                <strong style={{ fontSize: 18 }}>{tutor.name}</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <MapPin size={14} /> {tutor.city}
                </div>
                <div style={{ color: 'var(--accent-primary)', fontWeight: 700, marginTop: 4 }}>{tutor.price} MAD <span style={{fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)'}}>/ heure</span></div>
              </div>
            </div>

            {user && (
              <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 20, fontSize: 14, color: 'var(--text-secondary)' }}>
                👤 Réservation au nom de : <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong> ({user.email})
              </div>
            )}

            <form onSubmit={submit}>
              {/* Sélection matière */}
              {subjects.length > 1 && (
                <div className="form-group">
                  <label className="form-label">Matière</label>
                  <select className="form-input" value={subject} onChange={e => setSubject(e.target.value)}>
                    <option value="">Choisir une matière...</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-secondary)' }} />
                    <input type="date" required className="form-input" style={{ paddingLeft: 40 }} min={minDate} value={date} onChange={e => setDate(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Heure *</label>
                  <div style={{ position: 'relative' }}>
                    <Clock size={18} style={{ position: 'absolute', left: 14, top: 15, color: 'var(--text-secondary)' }} />
                    <input type="time" required className="form-input" style={{ paddingLeft: 40 }} value={time} onChange={e => setTime(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 32 }}>
                <label className="form-label">Message pour le tuteur (Optionnel)</label>
                <textarea className="form-input" placeholder="Ex: Je souhaite réviser le chapitre 4..." value={notes} onChange={e => setNotes(e.target.value)} rows={3}></textarea>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Annuler</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1 }} disabled={loading}>
                  {loading ? <><Loader size={16} className="spin-icon" /> Envoi...</> : 'Confirmer la réservation'}
                </button>
              </div>
              <style>{`.spin-icon { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
