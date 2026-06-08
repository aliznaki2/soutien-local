import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { getAdminStats, getAdminBookings, updateBookingStatus } from '../../services/api';
import {
  Users, Star, CheckCircle, XCircle,
  Edit2, ShieldOff, BarChart2, Clock, AlertCircle, Search,
  Home, LogOut, Shield, Calendar, Activity,
  ChevronRight, UserCheck, MapPin
} from 'lucide-react';

const FAKE_CANDIDATES = [
  { id: 101, name: 'Mehdi Alaoui', email: 'mehdi@email.com', subjects: 'Mathématiques, Physique', city: 'Rabat', price: 130, status: 'pending' },
  { id: 102, name: 'Sara Benchekroun', email: 'sara@email.com', subjects: 'Français, Anglais', city: 'Casablanca', price: 95, status: 'pending' },
  { id: 103, name: 'Karim Mansouri', email: 'karim@email.com', subjects: 'Informatique', city: 'Agadir', price: 145, status: 'pending' },
];

export default function AdminDashboard({ tutors }) {
  const { showToast } = useToast();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [tutorList, setTutorList] = useState(tutors.map(t => ({ ...t, active: true })));
  const [candidates, setCandidates] = useState(FAKE_CANDIDATES);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    getAdminStats().then(res => setStats(res.data.data)).catch(() => {});
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setBookingsLoading(true);
    getAdminBookings()
      .then(res => setAllBookings(res.data.data || []))
      .catch(() => {})
      .finally(() => setBookingsLoading(false));
  };

  const changeBookingStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      setAllBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      showToast(`Réservation ${status === 'confirmed' ? 'confirmée' : 'annulée'}`, status === 'confirmed' ? 'success' : 'error');
      getAdminStats().then(res => setStats(res.data.data)).catch(() => {});
    } catch { showToast('Erreur lors de la mise à jour', 'error'); }
  };

  const filteredTutors = tutorList.filter(t => {
    const subjects = Array.isArray(t.subjects) ? t.subjects : JSON.parse(t.subjects || '[]');
    return t.name.toLowerCase().includes(search.toLowerCase()) ||
      subjects.join(' ').toLowerCase().includes(search.toLowerCase());
  });

  const toggleTutor = (id) => {
    setTutorList(prev => prev.map(t => {
      if (t.id === id) {
        const s = !t.active;
        showToast(`${t.name} ${s ? 'activé' : 'désactivé'}`, s ? 'success' : 'error');
        return { ...t, active: s };
      }
      return t;
    }));
  };

  const acceptCandidate = (id) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: 'accepted' } : c));
    showToast('Candidature acceptée !', 'success');
  };

  const rejectCandidate = (id) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
    showToast('Candidature refusée.', 'error');
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const kpis = [
    { label: 'Tuteurs Actifs', value: stats?.total_tutors || tutors.length, icon: <Users size={22}/>, color: '#3b82f6', bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)' },
    { label: 'Utilisateurs', value: stats?.total_users || '—', icon: <UserCheck size={22}/>, color: '#10b981', bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)' },
    { label: 'Réservations', value: stats?.total_bookings || 0, icon: <Calendar size={22}/>, color: '#8b5cf6', bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' },
    { label: 'En attente', value: stats?.pending_bookings || 0, icon: <Clock size={22}/>, color: '#f59e0b', bg: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
  ];

  const sidebarItems = [
    { key: 'overview', icon: <BarChart2 size={18}/>, label: 'Vue d\'ensemble' },
    { key: 'tutors', icon: <Users size={18}/>, label: 'Tuteurs' },
    { key: 'bookings', icon: <Calendar size={18}/>, label: 'Réservations' },
    { key: 'candidates', icon: <AlertCircle size={18}/>, label: 'Candidatures' },
  ];

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <style>{`
        .adm-layout { display:flex; min-height:100vh; }
        .adm-side { width:260px; background:#1e293b; display:flex; flex-direction:column; border-right:1px solid rgba(255,255,255,0.06); }
        .adm-side-logo { padding:28px 24px; display:flex; align-items:center; gap:12px; border-bottom:1px solid rgba(255,255,255,0.06); }
        .adm-side-logo .icon-box { width:40px; height:40px; background:linear-gradient(135deg,#3b82f6,#6366f1); border-radius:12px; display:flex; align-items:center; justify-content:center; }
        .adm-side-logo h2 { color:#f8fafc; font-size:17px; font-weight:800; margin:0; }
        .adm-side-logo span { color:#64748b; font-size:11px; }
        .adm-nav { flex:1; padding:16px 12px; display:flex; flex-direction:column; gap:4px; }
        .adm-nav-item { display:flex; align-items:center; gap:12px; padding:11px 16px; border-radius:10px; color:#94a3b8; font-size:14px; font-weight:500; cursor:pointer; transition:all 0.2s; border:none; background:none; width:100%; text-align:left; }
        .adm-nav-item:hover { background:rgba(59,130,246,0.08); color:#e2e8f0; }
        .adm-nav-item.act { background:rgba(59,130,246,0.15); color:#60a5fa; font-weight:600; }
        .adm-side-footer { padding:16px; border-top:1px solid rgba(255,255,255,0.06); }
        .adm-side-user { display:flex; align-items:center; gap:10px; padding:10px; border-radius:10px; background:rgba(255,255,255,0.03); }
        .adm-side-user .avatar { width:36px; height:36px; background:linear-gradient(135deg,#6366f1,#3b82f6); border-radius:10px; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:14px; }
        .adm-side-user .info { flex:1; }
        .adm-side-user .info .name { color:#e2e8f0; font-size:13px; font-weight:600; }
        .adm-side-user .info .role { color:#64748b; font-size:11px; }

        .adm-main { flex:1; background:#0f172a; overflow-y:auto; }
        .adm-topbar { padding:20px 32px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.06); }
        .adm-topbar h1 { color:#f8fafc; font-size:22px; font-weight:700; margin:0; }
        .adm-topbar .sub { color:#64748b; font-size:13px; margin-top:2px; }
        .adm-body { padding:28px 32px; }

        .kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
        .kpi { background:#1e293b; border-radius:16px; padding:24px; border:1px solid rgba(255,255,255,0.06); transition:transform 0.2s; }
        .kpi:hover { transform:translateY(-2px); }
        .kpi .kpi-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
        .kpi .kpi-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; }
        .kpi .kpi-val { font-size:32px; font-weight:800; color:#f8fafc; }
        .kpi .kpi-lbl { color:#64748b; font-size:13px; font-weight:500; margin-top:4px; }

        .adm-card { background:#1e293b; border-radius:16px; border:1px solid rgba(255,255,255,0.06); overflow:hidden; margin-bottom:24px; }
        .adm-card-head { padding:20px 24px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.06); }
        .adm-card-title { color:#f8fafc; font-size:16px; font-weight:700; display:flex; align-items:center; gap:10px; }
        .adm-card-title .cnt { background:rgba(59,130,246,0.15); color:#60a5fa; padding:2px 10px; border-radius:20px; font-size:12px; font-weight:700; }

        .dtbl { width:100%; border-collapse:collapse; }
        .dtbl th { padding:12px 20px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.8px; color:#64748b; font-weight:600; background:rgba(0,0,0,0.2); }
        .dtbl td { padding:14px 20px; border-bottom:1px solid rgba(255,255,255,0.04); font-size:14px; color:#cbd5e1; vertical-align:middle; }
        .dtbl tr:hover td { background:rgba(59,130,246,0.04); }
        .dtbl tr:last-child td { border-bottom:none; }

        .sbadge { display:inline-flex; align-items:center; gap:4px; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }
        .sb-active { background:rgba(16,185,129,0.15); color:#34d399; }
        .sb-inactive { background:rgba(239,68,68,0.15); color:#f87171; }
        .sb-pending { background:rgba(245,158,11,0.15); color:#fbbf24; }
        .sb-accepted { background:rgba(16,185,129,0.15); color:#34d399; }
        .sb-rejected { background:rgba(239,68,68,0.15); color:#f87171; }

        .abtn { padding:6px 14px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); background:transparent; cursor:pointer; display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:600; transition:all 0.2s; color:#94a3b8; }
        .abtn:hover { background:rgba(255,255,255,0.05); }
        .abtn-ok { border-color:rgba(16,185,129,0.3); color:#34d399; }
        .abtn-ok:hover { background:rgba(16,185,129,0.15); }
        .abtn-no { border-color:rgba(239,68,68,0.3); color:#f87171; }
        .abtn-no:hover { background:rgba(239,68,68,0.15); }
        .abtn-blue { border-color:rgba(59,130,246,0.3); color:#60a5fa; }
        .abtn-blue:hover { background:rgba(59,130,246,0.15); }

        .search-dark { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:9px 14px 9px 38px; color:#e2e8f0; font-size:14px; outline:none; width:280px; transition:border 0.2s; }
        .search-dark::placeholder { color:#475569; }
        .search-dark:focus { border-color:rgba(59,130,246,0.4); }

        .back-btn { display:flex; align-items:center; gap:6px; color:#64748b; font-size:13px; cursor:pointer; background:none; border:none; padding:8px 14px; border-radius:8px; transition:all 0.2s; }
        .back-btn:hover { background:rgba(255,255,255,0.05); color:#e2e8f0; }

        @media(max-width:1024px){ .adm-side{display:none} .kpi-row{grid-template-columns:repeat(2,1fr)} .adm-body{padding:20px 16px} }
        @media(max-width:640px){ .kpi-row{grid-template-columns:1fr} }
      `}</style>

      <div className="adm-layout">
        {/* Sidebar */}
        <aside className="adm-side">
          <div className="adm-side-logo">
            <div className="icon-box"><Shield size={20} color="white"/></div>
            <div>
              <h2>SoutienLocal</h2>
              <span>Administration</span>
            </div>
          </div>
          <nav className="adm-nav">
            {sidebarItems.map(item => (
              <button key={item.key} className={`adm-nav-item ${activeTab === item.key ? 'act' : ''}`} onClick={() => setActiveTab(item.key)}>
                {item.icon} {item.label}
                {item.key === 'candidates' && (
                  <span style={{marginLeft:'auto',background:'rgba(245,158,11,0.15)',color:'#fbbf24',padding:'2px 8px',borderRadius:10,fontSize:11,fontWeight:700}}>
                    {candidates.filter(c => c.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="adm-side-footer">
            <div className="adm-side-user">
              <div className="avatar">{user?.name?.charAt(0) || 'A'}</div>
              <div className="info">
                <div className="name">{user?.name || 'Admin'}</div>
                <div className="role">Administrateur</div>
              </div>
            </div>
            <div style={{display:'flex',gap:8,marginTop:12}}>
              <button className="back-btn" style={{flex:1}} onClick={() => navigate('/')}><Home size={14}/> Accueil</button>
              <button className="back-btn" style={{flex:1}} onClick={handleLogout}><LogOut size={14}/> Quitter</button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="adm-main">
          <div className="adm-topbar">
            <div>
              <h1>{activeTab === 'overview' ? 'Tableau de bord' : activeTab === 'tutors' ? 'Gestion des Tuteurs' : 'Candidatures'}</h1>
              <div className="sub">Bienvenue, {user?.name || 'Admin'}. Voici le résumé de votre plateforme.</div>
            </div>
            <button className="back-btn" onClick={() => navigate('/')}><Home size={15}/> Retour au site</button>
          </div>

          <div className="adm-body">
            {/* === VUE D'ENSEMBLE === */}
            {activeTab === 'overview' && (<>
              <div className="kpi-row">
                {kpis.map((k, i) => (
                  <div key={i} className="kpi">
                    <div className="kpi-top">
                      <div className="kpi-icon" style={{background:k.bg,color:k.color}}>{k.icon}</div>
                      <Activity size={16} color="#334155"/>
                    </div>
                    <div className="kpi-val">{k.value}</div>
                    <div className="kpi-lbl">{k.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent tutors preview */}
              <div className="adm-card">
                <div className="adm-card-head">
                  <div className="adm-card-title"><Users size={18} color="#60a5fa"/> Derniers Tuteurs <span className="cnt">{tutors.length}</span></div>
                  <button className="abtn abtn-blue" onClick={() => setActiveTab('tutors')}>Voir tout <ChevronRight size={14}/></button>
                </div>
                <div style={{overflowX:'auto'}}>
                  <table className="dtbl">
                    <thead><tr><th>Tuteur</th><th>Matières</th><th>Ville</th><th>Tarif</th><th>Note</th></tr></thead>
                    <tbody>
                      {tutorList.slice(0, 5).map(t => {
                        const subjects = Array.isArray(t.subjects) ? t.subjects : JSON.parse(t.subjects || '[]');
                        return (
                          <tr key={t.id}>
                            <td><div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#6366f1,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:13}}>{t.name.charAt(0)}</div><div><div style={{fontWeight:600,color:'#e2e8f0'}}>{t.name}</div><div style={{fontSize:11,color:'#64748b'}}>{t.level}</div></div></div></td>
                            <td>{subjects.slice(0,2).map(s => <span key={s} style={{background:'rgba(59,130,246,0.1)',color:'#60a5fa',padding:'2px 8px',borderRadius:6,fontSize:11,marginRight:4,fontWeight:600}}>{s}</span>)}</td>
                            <td><span style={{display:'flex',alignItems:'center',gap:4}}><MapPin size={13} color="#64748b"/>{t.city}</span></td>
                            <td style={{fontWeight:700,color:'#60a5fa'}}>{t.price} MAD</td>
                            <td><span style={{display:'flex',alignItems:'center',gap:4,color:'#fbbf24',fontWeight:600}}><Star size={13} fill="currentColor"/>{t.rating}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>)}

            {/* === GESTION TUTEURS === */}
            {activeTab === 'tutors' && (
              <div className="adm-card">
                <div className="adm-card-head">
                  <div className="adm-card-title"><Users size={18} color="#60a5fa"/> Tous les Tuteurs <span className="cnt">{filteredTutors.length}</span></div>
                  <div style={{position:'relative'}}>
                    <Search size={15} style={{position:'absolute',left:12,top:10,color:'#475569'}}/>
                    <input className="search-dark" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}/>
                  </div>
                </div>
                <div style={{overflowX:'auto'}}>
                  <table className="dtbl">
                    <thead><tr><th>Tuteur</th><th>Matières</th><th>Ville</th><th>Tarif</th><th>Note</th><th>Statut</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filteredTutors.map(t => {
                        const subjects = Array.isArray(t.subjects) ? t.subjects : JSON.parse(t.subjects || '[]');
                        return (
                          <tr key={t.id}>
                            <td><div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#6366f1,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:13}}>{t.name.charAt(0)}</div><div><div style={{fontWeight:600,color:'#e2e8f0'}}>{t.name}</div><div style={{fontSize:11,color:'#64748b'}}>{t.level}</div></div></div></td>
                            <td>{subjects.slice(0,2).map(s => <span key={s} style={{background:'rgba(59,130,246,0.1)',color:'#60a5fa',padding:'2px 8px',borderRadius:6,fontSize:11,marginRight:4,fontWeight:600}}>{s}</span>)}</td>
                            <td style={{color:'#94a3b8'}}>{t.city}</td>
                            <td style={{fontWeight:700,color:'#60a5fa'}}>{t.price} MAD</td>
                            <td><span style={{display:'flex',alignItems:'center',gap:4,color:'#fbbf24',fontWeight:600}}><Star size={13} fill="currentColor"/>{t.rating}</span></td>
                            <td><span className={`sbadge ${t.active ? 'sb-active' : 'sb-inactive'}`}>{t.active ? '● Actif' : '● Inactif'}</span></td>
                            <td>
                              <div style={{display:'flex',gap:6}}>
                                <button className="abtn abtn-blue" onClick={() => showToast(`Édition de ${t.name}`, 'info')}><Edit2 size={12}/> Éditer</button>
                                <button className={`abtn ${t.active ? 'abtn-no' : 'abtn-ok'}`} onClick={() => toggleTutor(t.id)}>
                                  {t.active ? <><ShieldOff size={12}/> Désactiver</> : <><CheckCircle size={12}/> Activer</>}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* === RÉSERVATIONS === */}
            {activeTab === 'bookings' && (
              <div className="adm-card">
                <div className="adm-card-head">
                  <div className="adm-card-title"><Calendar size={18} color="#8b5cf6"/> Toutes les Réservations <span className="cnt" style={{background:'rgba(139,92,246,0.15)',color:'#a78bfa'}}>{allBookings.length}</span></div>
                  <button className="abtn abtn-blue" onClick={fetchBookings}><ChevronRight size={14}/> Actualiser</button>
                </div>
                {bookingsLoading ? (
                  <div style={{padding:40,textAlign:'center',color:'#64748b'}}>Chargement...</div>
                ) : allBookings.length === 0 ? (
                  <div style={{padding:60,textAlign:'center'}}>
                    <div style={{fontSize:40,marginBottom:12}}>📭</div>
                    <div style={{color:'#64748b',fontSize:15}}>Aucune réservation pour le moment</div>
                  </div>
                ) : (
                  <div style={{overflowX:'auto'}}>
                    <table className="dtbl">
                      <thead><tr><th>Élève</th><th>Tuteur</th><th>Date</th><th>Heure</th><th>Matière</th><th>Statut</th><th>Actions</th></tr></thead>
                      <tbody>
                        {allBookings.map(b => (
                          <tr key={b.id}>
                            <td>
                              <div>
                                <div style={{fontWeight:600,color:'#e2e8f0'}}>{b.user?.name || 'Utilisateur'}</div>
                                <div style={{fontSize:11,color:'#64748b'}}>{b.user?.email || ''}</div>
                              </div>
                            </td>
                            <td>
                              <div style={{display:'flex',alignItems:'center',gap:8}}>
                                <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#6366f1,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:12}}>{(b.tutor?.name || 'T').charAt(0)}</div>
                                <div style={{fontWeight:600,color:'#cbd5e1'}}>{b.tutor?.name || '—'}</div>
                              </div>
                            </td>
                            <td style={{color:'#94a3b8'}}>
                              {new Date(b.date).toLocaleDateString('fr-FR', {day:'numeric',month:'short',year:'numeric'})}
                            </td>
                            <td style={{color:'#94a3b8'}}>{b.time || '—'}</td>
                            <td style={{color:'#94a3b8'}}>{b.subject || '—'}</td>
                            <td>
                              <span className={`sbadge sb-${b.status}`}>
                                {b.status === 'pending' ? '⏳ En attente' : b.status === 'confirmed' ? '✓ Confirmée' : '✗ Annulée'}
                              </span>
                            </td>
                            <td>
                              {b.status === 'pending' ? (
                                <div style={{display:'flex',gap:6}}>
                                  <button className="abtn abtn-ok" onClick={() => changeBookingStatus(b.id, 'confirmed')}><CheckCircle size={12}/> Confirmer</button>
                                  <button className="abtn abtn-no" onClick={() => changeBookingStatus(b.id, 'cancelled')}><XCircle size={12}/> Annuler</button>
                                </div>
                              ) : (
                                <span style={{fontSize:12,color:'#475569'}}>Traité</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* === CANDIDATURES === */}
            {activeTab === 'candidates' && (
              <div className="adm-card">
                <div className="adm-card-head">
                  <div className="adm-card-title"><AlertCircle size={18} color="#fbbf24"/> Candidatures <span className="cnt" style={{background:'rgba(245,158,11,0.15)',color:'#fbbf24'}}>{candidates.filter(c => c.status === 'pending').length} en attente</span></div>
                </div>
                <div style={{overflowX:'auto'}}>
                  <table className="dtbl">
                    <thead><tr><th>Candidat</th><th>Matières</th><th>Ville</th><th>Tarif</th><th>Statut</th><th>Actions</th></tr></thead>
                    <tbody>
                      {candidates.map(c => (
                        <tr key={c.id}>
                          <td><div><div style={{fontWeight:600,color:'#e2e8f0'}}>{c.name}</div><div style={{fontSize:11,color:'#64748b'}}>{c.email}</div></div></td>
                          <td style={{color:'#94a3b8'}}>{c.subjects}</td>
                          <td style={{color:'#94a3b8'}}>{c.city}</td>
                          <td style={{fontWeight:700,color:'#60a5fa'}}>{c.price} MAD</td>
                          <td><span className={`sbadge sb-${c.status}`}>{c.status === 'pending' ? '⏳ En attente' : c.status === 'accepted' ? '✓ Accepté' : '✗ Refusé'}</span></td>
                          <td>
                            {c.status === 'pending' ? (
                              <div style={{display:'flex',gap:6}}>
                                <button className="abtn abtn-ok" onClick={() => acceptCandidate(c.id)}><CheckCircle size={12}/> Accepter</button>
                                <button className="abtn abtn-no" onClick={() => rejectCandidate(c.id)}><XCircle size={12}/> Refuser</button>
                              </div>
                            ) : <span style={{fontSize:12,color:'#475569'}}>Traité</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
