import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookings } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar, Clock, MapPin, BookOpen, CheckCircle, XCircle,
  Hourglass, ArrowLeft, RefreshCw, User, MessageSquare, CreditCard
} from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchBookings = () => {
    setLoading(true);
    getBookings()
      .then(res => {
        const data = res.data.data || res.data;
        setBookings(Array.isArray(data) ? data : []);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const statusConfig = {
    pending: { label: 'En attente', icon: <Hourglass size={14}/>, color: '#f59e0b', bg: '#fef3c7' },
    confirmed: { label: 'Confirmée', icon: <CheckCircle size={14}/>, color: '#10b981', bg: '#d1fae5' },
    cancelled: { label: 'Annulée', icon: <XCircle size={14}/>, color: '#ef4444', bg: '#fee2e2' },
  };

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="container animate-fade-up" style={{ padding: '32px 24px', maxWidth: 900 }}>
      <style>{`
        .bk-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; flex-wrap:wrap; gap:16px; }
        .bk-tabs { display:flex; gap:8px; flex-wrap:wrap; }
        .bk-tab { padding:8px 18px; border-radius:var(--radius-full); border:1px solid var(--border-light); background:var(--bg-secondary); color:var(--text-secondary); font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:6px; }
        .bk-tab:hover { border-color:var(--accent-primary); color:var(--accent-primary); }
        .bk-tab.active { background:var(--accent-primary); color:white; border-color:var(--accent-primary); }
        .bk-tab .cnt { background:rgba(255,255,255,0.2); padding:1px 7px; border-radius:10px; font-size:11px; }
        .bk-tab:not(.active) .cnt { background:var(--bg-primary); }

        .bk-card { background:var(--bg-secondary); border-radius:var(--radius-lg); border:1px solid var(--border-light); box-shadow:var(--shadow-sm); padding:24px; margin-bottom:16px; transition:all 0.2s; }
        .bk-card:hover { box-shadow:var(--shadow-md); transform:translateY(-1px); }
        .bk-card-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
        .bk-tutor { display:flex; align-items:center; gap:14px; }
        .bk-tutor-avatar { width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg,var(--accent-primary),#4f46e5); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:18px; flex-shrink:0; }
        .bk-tutor-name { font-size:17px; font-weight:700; color:var(--text-primary); }
        .bk-tutor-sub { font-size:13px; color:var(--text-secondary); margin-top:2px; }

        .bk-status { display:inline-flex; align-items:center; gap:5px; padding:5px 14px; border-radius:var(--radius-full); font-size:12px; font-weight:700; }

        .bk-details { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:16px; padding-top:16px; border-top:1px solid var(--border-light); }
        .bk-detail { display:flex; align-items:center; gap:8px; }
        .bk-detail-icon { width:32px; height:32px; border-radius:8px; background:var(--bg-primary); display:flex; align-items:center; justify-content:center; color:var(--text-secondary); flex-shrink:0; }
        .bk-detail-label { font-size:11px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px; }
        .bk-detail-value { font-size:14px; font-weight:600; color:var(--text-primary); }

        .bk-message { margin-top:16px; padding:12px 16px; background:var(--bg-primary); border-radius:var(--radius-md); font-size:13px; color:var(--text-secondary); display:flex; align-items:flex-start; gap:8px; }

        .bk-empty { text-align:center; padding:60px 20px; background:var(--bg-secondary); border-radius:var(--radius-lg); border:1px solid var(--border-light); }

        .refresh-btn { display:flex; align-items:center; gap:6px; padding:8px 16px; border-radius:var(--radius-full); border:1px solid var(--border-light); background:var(--bg-secondary); color:var(--text-secondary); font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; }
        .refresh-btn:hover { border-color:var(--accent-primary); color:var(--accent-primary); }
        
        .loading-cards { display:flex; flex-direction:column; gap:16px; }
        .loading-card { background:var(--bg-secondary); border-radius:var(--radius-lg); border:1px solid var(--border-light); padding:24px; }
        .skeleton { background:linear-gradient(90deg,var(--bg-primary) 25%,var(--border-light) 50%,var(--bg-primary) 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:6px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>

      {/* Header */}
      <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ padding: 0, marginBottom: 16 }}>
        <ArrowLeft size={18} /> Retour
      </button>

      <div className="bk-header">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Mes Réservations</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Suivez l'état de vos demandes de cours, {user?.name?.split(' ')[0] || 'Élève'}
          </p>
        </div>
        <button className="refresh-btn" onClick={fetchBookings}>
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {/* Tabs */}
      <div className="bk-tabs" style={{ marginBottom: 24 }}>
        {[
          { key: 'all', label: 'Toutes' },
          { key: 'pending', label: 'En attente' },
          { key: 'confirmed', label: 'Confirmées' },
          { key: 'cancelled', label: 'Annulées' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`bk-tab ${filter === tab.key ? 'active' : ''}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label} <span className="cnt">{counts[tab.key]}</span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-cards">
          {[1,2,3].map(i => (
            <div key={i} className="loading-card">
              <div style={{display:'flex',gap:14,marginBottom:16}}>
                <div className="skeleton" style={{width:52,height:52,borderRadius:14}}/>
                <div style={{flex:1}}>
                  <div className="skeleton" style={{width:'40%',height:18,marginBottom:8}}/>
                  <div className="skeleton" style={{width:'25%',height:14}}/>
                </div>
              </div>
              <div className="skeleton" style={{width:'100%',height:60}}/>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="bk-empty">
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <h3 style={{ marginBottom: 8, fontWeight: 700 }}>
            {filter === 'all' ? 'Aucune réservation pour le moment' : `Aucune réservation ${statusConfig[filter]?.label?.toLowerCase() || ''}`}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            Trouvez un tuteur et réservez votre première séance !
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Trouver un tuteur
          </button>
        </div>
      )}

      {/* Booking cards */}
      {!loading && filtered.map(b => {
        let st = { ...statusConfig[b.status] || statusConfig.pending };
        if (b.status === 'confirmed') {
          if (b.payment_status === 'paid') {
            st = { label: 'Confirmée & Payée', icon: <CheckCircle size={14}/>, color: '#10b981', bg: '#d1fae5' };
          } else {
            st = { label: 'Confirmée - Paiement requis', icon: <CreditCard size={14}/>, color: '#f59e0b', bg: '#fef3c7' };
          }
        }
        
        const tutorName = b.tutor?.name || 'Tuteur';
        const tutorCity = b.tutor?.city || '';

        return (
          <div key={b.id} className="bk-card">
            <div className="bk-card-top">
              <div className="bk-tutor">
                <div className="bk-tutor-avatar">{tutorName.charAt(0)}</div>
                <div>
                  <div className="bk-tutor-name">{tutorName}</div>
                  {tutorCity && (
                    <div className="bk-tutor-sub" style={{display:'flex',alignItems:'center',gap:4}}>
                      <MapPin size={12}/> {tutorCity}
                    </div>
                  )}
                </div>
              </div>
              <span className="bk-status" style={{ background: st.bg, color: st.color }}>
                {st.icon} {st.label}
              </span>
            </div>

            <div className="bk-details">
              <div className="bk-detail">
                <div className="bk-detail-icon"><Calendar size={15}/></div>
                <div>
                  <div className="bk-detail-label">Date</div>
                  <div className="bk-detail-value">
                    {new Date(b.date).toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short', year:'numeric' })}
                  </div>
                </div>
              </div>
              {b.time && (
                <div className="bk-detail">
                  <div className="bk-detail-icon"><Clock size={15}/></div>
                  <div>
                    <div className="bk-detail-label">Heure</div>
                    <div className="bk-detail-value">{b.time}</div>
                  </div>
                </div>
              )}
              {b.subject && (
                <div className="bk-detail">
                  <div className="bk-detail-icon"><BookOpen size={15}/></div>
                  <div>
                    <div className="bk-detail-label">Matière</div>
                    <div className="bk-detail-value">{b.subject}</div>
                  </div>
                </div>
              )}
              <div className="bk-detail">
                <div className="bk-detail-icon"><User size={15}/></div>
                <div>
                  <div className="bk-detail-label">Tarif</div>
                  <div className="bk-detail-value" style={{color:'var(--accent-primary)'}}>{b.tutor?.price || '—'} MAD/h</div>
                </div>
              </div>
            </div>

            {b.message && (
              <div className="bk-message">
                <MessageSquare size={14} style={{marginTop:2,flexShrink:0}}/>
                <span>{b.message}</span>
              </div>
            )}

            {/* Détails du paiement s'il est effectué */}
            {b.payment_status === 'paid' && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', fontSize: 13, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 6 }}>
                💳 Payé le {new Date(b.payment_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            )}

            {/* Bouton de paiement si non payé et confirmé */}
            {b.status === 'confirmed' && b.payment_status !== 'paid' && (
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
                <button 
                  className="btn btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 13 }}
                  onClick={() => {
                    setSelectedBooking(b);
                    setPaymentModalOpen(true);
                  }}
                >
                  <CreditCard size={15} /> Procéder au paiement ({b.tutor?.price || '—'} MAD)
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Modal de paiement */}
      <PaymentModal 
        visible={paymentModalOpen}
        booking={selectedBooking}
        onClose={() => {
          setPaymentModalOpen(false);
          setSelectedBooking(null);
        }}
        onPaymentSuccess={fetchBookings}
      />
    </div>
  );
}
