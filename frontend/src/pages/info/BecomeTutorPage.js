import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, BookOpen, MapPin, DollarSign, MessageSquare } from 'lucide-react';

import { useToast } from '../../context/ToastContext';

export default function BecomeTutorPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return (
    <div className="container animate-fade-up" style={{ padding: '40px 24px', maxWidth: 700 }}>
      <div style={{ background: 'var(--bg-secondary)', padding: '50px 40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="tag badge-warning" style={{ marginBottom: 12 }}>Recrutement Ouvert</span>
          <h1 style={{ fontSize: 32, fontWeight: 800 }}>Devenez Tuteur d'Élite</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginTop: 8 }}>Rejoignez notre réseau et partagez votre passion avec des centaines d'élèves motivés.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); showToast("Candidature envoyée avec succès ! Notre équipe l'examinera sous 48h.", 'success'); navigate('/'); }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <div className="form-group">
              <label className="form-label">Nom complet</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 16, top: 15, color: 'var(--text-secondary)' }} />
                <input required className="form-input" style={{ paddingLeft: 44 }} />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Email professionnel</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 16, top: 15, color: 'var(--text-secondary)' }} />
                <input type="email" required className="form-input" style={{ paddingLeft: 44 }} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Matières enseignées (séparées par des virgules)</label>
            <div style={{ position: 'relative' }}>
              <BookOpen size={18} style={{ position: 'absolute', left: 16, top: 15, color: 'var(--text-secondary)' }} />
              <input required className="form-input" style={{ paddingLeft: 44 }} placeholder="Mathématiques, Physique, etc." />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <div className="form-group">
              <label className="form-label">Ville (ou En Ligne)</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: 16, top: 15, color: 'var(--text-secondary)' }} />
                <input required className="form-input" style={{ paddingLeft: 44 }} />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Tarif horaire (MAD)</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={18} style={{ position: 'absolute', left: 16, top: 15, color: 'var(--text-secondary)' }} />
                <input type="number" min="50" required className="form-input" style={{ paddingLeft: 44 }} />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 32 }}>
            <label className="form-label">Présentez votre parcours et votre méthode</label>
            <div style={{ position: 'relative' }}>
              <MessageSquare size={18} style={{ position: 'absolute', left: 16, top: 16, color: 'var(--text-secondary)' }} />
              <textarea rows={5} required className="form-input" style={{ paddingLeft: 44, paddingTop: 14 }} placeholder="Décrivez votre expérience..."></textarea>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: 16 }}>Soumettre ma candidature</button>
        </form>
      </div>
    </div>
  );
}
