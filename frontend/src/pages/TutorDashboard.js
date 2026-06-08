import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getTutorStats, getTutorBookings, updateTutorProfile } from '../services/api';
import {
  Users, Calendar, Clock, CheckCircle, TrendingUp,
  BarChart2, BookOpen, MapPin, Edit3, Save, Home, LogOut,
  GraduationCap, Briefcase, Globe, Award, Lightbulb, RefreshCw,
  User, MessageSquare, Activity, ChevronRight
} from 'lucide-react';

export default function TutorDashboard() {
  const { user, logoutUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Profile editing
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '', subjects: [], level: '', city: '', price: 0,
    bio: '', experience: '', languages: [], education: '', method: '', avatar: '',
  });

  const [availability, setAvailability] = useState({
    lundi: { active: true, start: '09:00', end: '17:00' },
    mardi: { active: true, start: '09:00', end: '17:00' },
    mercredi: { active: true, start: '09:00', end: '17:00' },
    jeudi: { active: true, start: '09:00', end: '17:00' },
    vendredi: { active: true, start: '09:00', end: '17:00' },
    samedi: { active: false, start: '10:00', end: '14:00' },
    dimanche: { active: false, start: '', end: '' },
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      getTutorStats().catch(() => ({ data: { data: null } })),
      getTutorBookings().catch(() => ({ data: { data: [] } })),
    ]).then(([statsRes, bookingsRes]) => {
      const s = statsRes.data.data;
      setStats(s);
      setBookings(bookingsRes.data.data || []);
      if (s?.tutor) {
        setProfile({
          name: s.tutor.name || user?.name || '',
          subjects: Array.isArray(s.tutor.subjects) ? s.tutor.subjects : [],
          level: s.tutor.level || '',
          city: s.tutor.city || '',
          price: s.tutor.price || 0,
          bio: s.tutor.bio || '',
          experience: s.tutor.experience || '',
          languages: Array.isArray(s.tutor.languages) ? s.tutor.languages : [],
          education: s.tutor.education || '',
          method: s.tutor.method || '',
          avatar: s.tutor.avatar || '',
        });
      }
    }).finally(() => setLoading(false));
  };

  const fetchBookings = () => {
    setBookingsLoading(true);
    getTutorBookings()
      .then(res => setBookings(res.data.data || []))
      .catch(() => {})
      .finally(() => setBookingsLoading(false));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        ...profile,
        price: parseFloat(profile.price) || 0,
      };
      await updateTutorProfile(payload);
      showToast('Profil mis à jour avec succès !', 'success');
      setEditing(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de la sauvegarde';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const kpis = [
    { label: 'Réservations reçues', value: stats?.total_bookings || 0, icon: <Calendar size={22}/>, color: '#3b82f6', bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)' },
    { label: 'Confirmées', value: stats?.confirmed || 0, icon: <CheckCircle size={22}/>, color: '#10b981', bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)' },
    { label: 'En attente', value: stats?.pending || 0, icon: <Clock size={22}/>, color: '#f59e0b', bg: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
    { label: 'Revenus (MAD)', value: stats?.total_revenue || 0, icon: <TrendingUp size={22}/>, color: '#8b5cf6', bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' },
  ];

  const sidebarItems = [
    { key: 'overview', icon: <BarChart2 size={18}/>, label: 'Vue d\'ensemble' },
    { key: 'students', icon: <Users size={18}/>, label: 'Mes Élèves' },
    { key: 'profile', icon: <User size={18}/>, label: 'Mon Profil' },
    { key: 'availability', icon: <Clock size={18}/>, label: 'Disponibilités' },
  ];

  const statusConfig = {
    pending: { label: 'En attente', color: '#fbbf24', bg: 'rgba(245,158,11,0.15)' },
    confirmed: { label: 'Confirmée', color: '#34d399', bg: 'rgba(16,185,129,0.15)' },
    cancelled: { label: 'Annulée', color: '#f87171', bg: 'rgba(239,68,68,0.15)' },
  };

  const dayLabels = {
    lundi: 'Lundi', mardi: 'Mardi', mercredi: 'Mercredi', jeudi: 'Jeudi',
    vendredi: 'Vendredi', samedi: 'Samedi', dimanche: 'Dimanche'
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <style>{`
        .td-layout { display:flex; min-height:100vh; }
        .td-side { width:260px; background:#1e293b; display:flex; flex-direction:column; border-right:1px solid rgba(255,255,255,0.06); }
        .td-side-logo { padding:28px 24px; display:flex; align-items:center; gap:12px; border-bottom:1px solid rgba(255,255,255,0.06); }
        .td-side-logo .icon-box { width:40px; height:40px; background:linear-gradient(135deg,#10b981,#059669); border-radius:12px; display:flex; align-items:center; justify-content:center; }
        .td-side-logo h2 { color:#f8fafc; font-size:17px; font-weight:800; margin:0; }
        .td-side-logo span { color:#64748b; font-size:11px; }
        .td-nav { flex:1; padding:16px 12px; display:flex; flex-direction:column; gap:4px; }
        .td-nav-item { display:flex; align-items:center; gap:12px; padding:11px 16px; border-radius:10px; color:#94a3b8; font-size:14px; font-weight:500; cursor:pointer; transition:all 0.2s; border:none; background:none; width:100%; text-align:left; }
        .td-nav-item:hover { background:rgba(16,185,129,0.08); color:#e2e8f0; }
        .td-nav-item.act { background:rgba(16,185,129,0.15); color:#34d399; font-weight:600; }
        .td-side-footer { padding:16px; border-top:1px solid rgba(255,255,255,0.06); }
        .td-side-user { display:flex; align-items:center; gap:10px; padding:10px; border-radius:10px; background:rgba(255,255,255,0.03); }
        .td-side-user .avatar { width:36px; height:36px; background:linear-gradient(135deg,#10b981,#059669); border-radius:10px; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:14px; }
        .td-side-user .info { flex:1; }
        .td-side-user .info .name { color:#e2e8f0; font-size:13px; font-weight:600; }
        .td-side-user .info .role { color:#64748b; font-size:11px; }

        .td-main { flex:1; background:#0f172a; overflow-y:auto; }
        .td-topbar { padding:20px 32px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.06); }
        .td-topbar h1 { color:#f8fafc; font-size:22px; font-weight:700; margin:0; }
        .td-topbar .sub { color:#64748b; font-size:13px; margin-top:2px; }
        .td-body { padding:28px 32px; }

        .td-kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
        .td-kpi { background:#1e293b; border-radius:16px; padding:24px; border:1px solid rgba(255,255,255,0.06); transition:transform 0.2s; }
        .td-kpi:hover { transform:translateY(-2px); }
        .td-kpi .kpi-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
        .td-kpi .kpi-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; }
        .td-kpi .kpi-val { font-size:32px; font-weight:800; color:#f8fafc; }
        .td-kpi .kpi-lbl { color:#64748b; font-size:13px; font-weight:500; margin-top:4px; }

        .td-card { background:#1e293b; border-radius:16px; border:1px solid rgba(255,255,255,0.06); overflow:hidden; margin-bottom:24px; }
        .td-card-head { padding:20px 24px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.06); }
        .td-card-title { color:#f8fafc; font-size:16px; font-weight:700; display:flex; align-items:center; gap:10px; }
        .td-card-title .cnt { background:rgba(16,185,129,0.15); color:#34d399; padding:2px 10px; border-radius:20px; font-size:12px; font-weight:700; }

        .td-tbl { width:100%; border-collapse:collapse; }
        .td-tbl th { padding:12px 20px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.8px; color:#64748b; font-weight:600; background:rgba(0,0,0,0.2); }
        .td-tbl td { padding:14px 20px; border-bottom:1px solid rgba(255,255,255,0.04); font-size:14px; color:#cbd5e1; vertical-align:middle; }
        .td-tbl tr:hover td { background:rgba(16,185,129,0.04); }
        .td-tbl tr:last-child td { border-bottom:none; }

        .td-badge { display:inline-flex; align-items:center; gap:4px; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }

        .td-btn { padding:6px 14px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); background:transparent; cursor:pointer; display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:600; transition:all 0.2s; color:#94a3b8; font-family:inherit; }
        .td-btn:hover { background:rgba(255,255,255,0.05); }
        .td-btn-green { border-color:rgba(16,185,129,0.3); color:#34d399; }
        .td-btn-green:hover { background:rgba(16,185,129,0.15); }

        .td-back-btn { display:flex; align-items:center; gap:6px; color:#64748b; font-size:13px; cursor:pointer; background:none; border:none; padding:8px 14px; border-radius:8px; transition:all 0.2s; font-family:inherit; }
        .td-back-btn:hover { background:rgba(255,255,255,0.05); color:#e2e8f0; }

        .td-input { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:10px 14px; color:#e2e8f0; font-size:14px; outline:none; width:100%; transition:border 0.2s; font-family:inherit; }
        .td-input::placeholder { color:#475569; }
        .td-input:focus { border-color:rgba(16,185,129,0.5); }
        .td-input:disabled { opacity:0.5; cursor:not-allowed; }
        textarea.td-input { min-height:80px; resize:vertical; }

        .td-profile-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        .td-profile-field label { display:block; font-size:12px; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px; }
        .td-profile-field.full { grid-column:1/-1; }

        .td-avail-row { display:flex; align-items:center; gap:16px; padding:14px 20px; border-bottom:1px solid rgba(255,255,255,0.04); }
        .td-avail-row:last-child { border-bottom:none; }
        .td-avail-day { width:100px; color:#e2e8f0; font-weight:600; font-size:14px; }
        .td-avail-toggle { width:44px; height:24px; border-radius:12px; background:rgba(255,255,255,0.1); position:relative; cursor:pointer; transition:all 0.2s; border:none; }
        .td-avail-toggle.on { background:rgba(16,185,129,0.4); }
        .td-avail-toggle::after { content:''; position:absolute; width:18px; height:18px; border-radius:50%; background:white; top:3px; left:3px; transition:all 0.2s; }
        .td-avail-toggle.on::after { left:23px; }
        .td-avail-times { display:flex; align-items:center; gap:8px; }
        .td-avail-times input { width:90px; }

        .td-next-card { background:linear-gradient(135deg,#10b981,#059669); border-radius:16px; padding:28px; margin-bottom:24px; color:white; }

        @media(max-width:1024px){ .td-side{display:none} .td-kpi-row{grid-template-columns:repeat(2,1fr)} .td-body{padding:20px 16px} .td-profile-grid{grid-template-columns:1fr} }
        @media(max-width:640px){ .td-kpi-row{grid-template-columns:1fr} }
      `}</style>

      <div className="td-layout">
        {/* Sidebar */}
        <aside className="td-side">
          <div className="td-side-logo">
            <div className="icon-box"><GraduationCap size={20} color="white"/></div>
            <div>
              <h2>SoutienLocal</h2>
              <span>Espace Tuteur</span>
            </div>
          </div>
          <nav className="td-nav">
            {sidebarItems.map(item => (
              <button key={item.key} className={`td-nav-item ${activeTab === item.key ? 'act' : ''}`} onClick={() => setActiveTab(item.key)}>
                {item.icon} {item.label}
                {item.key === 'students' && bookings.filter(b => b.status === 'pending').length > 0 && (
                  <span style={{marginLeft:'auto',background:'rgba(245,158,11,0.15)',color:'#fbbf24',padding:'2px 8px',borderRadius:10,fontSize:11,fontWeight:700}}>
                    {bookings.filter(b => b.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="td-side-footer">
            <div className="td-side-user">
              <div className="avatar">{user?.name?.charAt(0) || 'T'}</div>
              <div className="info">
                <div className="name">{user?.name || 'Tuteur'}</div>
                <div className="role">Tuteur</div>
              </div>
            </div>
            <div style={{display:'flex',gap:8,marginTop:12}}>
              <button className="td-back-btn" style={{flex:1}} onClick={() => navigate('/')}><Home size={14}/> Accueil</button>
              <button className="td-back-btn" style={{flex:1}} onClick={handleLogout}><LogOut size={14}/> Quitter</button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="td-main">
          <div className="td-topbar">
            <div>
              <h1>
                {activeTab === 'overview' ? '📊 Tableau de bord' :
                 activeTab === 'students' ? '👨‍🎓 Mes Élèves' :
                 activeTab === 'profile' ? '✏️ Mon Profil Tuteur' :
                 '📅 Mes Disponibilités'}
              </h1>
              <div className="sub">Bienvenue, {user?.name || 'Tuteur'}. Gérez votre activité de tuteur.</div>
            </div>
            <button className="td-back-btn" onClick={() => navigate('/')}><Home size={15}/> Retour au site</button>
          </div>

          <div className="td-body">
            {loading ? (
              <div style={{textAlign:'center',padding:80,color:'#64748b'}}>
                <div style={{width:48,height:48,border:'4px solid rgba(255,255,255,0.1)',borderTopColor:'#10b981',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 16px'}}/>
                Chargement...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                {/* ═══ VUE D'ENSEMBLE ═══ */}
                {activeTab === 'overview' && (<>
                  <div className="td-kpi-row">
                    {kpis.map((k, i) => (
                      <div key={i} className="td-kpi">
                        <div className="kpi-top">
                          <div className="kpi-icon" style={{background:k.bg,color:k.color}}>{k.icon}</div>
                          <Activity size={16} color="#334155"/>
                        </div>
                        <div className="kpi-val">{k.value}</div>
                        <div className="kpi-lbl">{k.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Next booking card */}
                  {stats?.next_booking && (
                    <div className="td-next-card">
                      <div style={{fontSize:13,fontWeight:600,opacity:0.8,marginBottom:12}}>🎯 PROCHAINE SÉANCE</div>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
                        <div>
                          <div style={{fontSize:20,fontWeight:700,marginBottom:6}}>{stats.next_booking.user?.name || 'Élève'}</div>
                          <div style={{display:'flex',gap:16,opacity:0.9,fontSize:14}}>
                            <span style={{display:'flex',alignItems:'center',gap:4}}>
                              <Calendar size={14}/> {new Date(stats.next_booking.date).toLocaleDateString('fr-FR', {weekday:'long',day:'numeric',month:'long'})}
                            </span>
                            {stats.next_booking.time && <span style={{display:'flex',alignItems:'center',gap:4}}><Clock size={14}/> {stats.next_booking.time}</span>}
                          </div>
                        </div>
                        <button onClick={() => setActiveTab('students')} style={{
                          background:'rgba(255,255,255,0.2)',border:'1px solid rgba(255,255,255,0.3)',
                          color:'white',padding:'10px 20px',borderRadius:'9999px',
                          cursor:'pointer',fontWeight:600,fontSize:13,fontFamily:'inherit',
                        }}>Voir détails</button>
                      </div>
                    </div>
                  )}

                  {/* Recent students */}
                  {stats?.recent_students?.length > 0 && (
                    <div className="td-card">
                      <div className="td-card-head">
                        <div className="td-card-title"><Users size={18} color="#34d399"/> Élèves récents <span className="cnt">{stats.recent_students.length}</span></div>
                        <button className="td-btn td-btn-green" onClick={() => setActiveTab('students')}>Voir tout <ChevronRight size={14}/></button>
                      </div>
                      <div style={{padding:16,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
                        {stats.recent_students.map(s => (
                          <div key={s.id} style={{
                            display:'flex',alignItems:'center',gap:12,padding:14,
                            background:'rgba(255,255,255,0.03)',borderRadius:12,
                          }}>
                            <div style={{width:40,height:40,borderRadius:10,background:'linear-gradient(135deg,#10b981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:14}}>
                              {s.name?.charAt(0) || 'E'}
                            </div>
                            <div>
                              <div style={{fontWeight:600,color:'#e2e8f0',fontSize:14}}>{s.name}</div>
                              <div style={{fontSize:12,color:'#64748b'}}>{s.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick stats if no data */}
                  {!stats?.tutor && (
                    <div className="td-card">
                      <div style={{padding:60,textAlign:'center'}}>
                        <div style={{fontSize:48,marginBottom:16}}>📝</div>
                        <div style={{color:'#f8fafc',fontSize:18,fontWeight:700,marginBottom:8}}>Complétez votre profil</div>
                        <div style={{color:'#64748b',fontSize:14,marginBottom:24}}>Renseignez vos informations pour apparaître dans les résultats de recherche.</div>
                        <button className="td-btn td-btn-green" style={{padding:'10px 24px',fontSize:14}} onClick={() => setActiveTab('profile')}>
                          <Edit3 size={14}/> Créer mon profil
                        </button>
                      </div>
                    </div>
                  )}
                </>)}

                {/* ═══ MES ÉLÈVES ═══ */}
                {activeTab === 'students' && (
                  <div className="td-card">
                    <div className="td-card-head">
                      <div className="td-card-title"><Users size={18} color="#34d399"/> Réservations reçues <span className="cnt">{bookings.length}</span></div>
                      <button className="td-btn td-btn-green" onClick={fetchBookings}><RefreshCw size={14}/> Actualiser</button>
                    </div>
                    {bookingsLoading ? (
                      <div style={{padding:40,textAlign:'center',color:'#64748b'}}>Chargement...</div>
                    ) : bookings.length === 0 ? (
                      <div style={{padding:60,textAlign:'center'}}>
                        <div style={{fontSize:48,marginBottom:16}}>📭</div>
                        <div style={{color:'#f8fafc',fontSize:18,fontWeight:700,marginBottom:8}}>Aucune réservation pour le moment</div>
                        <div style={{color:'#64748b',fontSize:14}}>Les élèves pourront vous réserver dès que votre profil sera visible.</div>
                      </div>
                    ) : (
                      <div style={{overflowX:'auto'}}>
                        <table className="td-tbl">
                          <thead><tr><th>Élève</th><th>Date</th><th>Heure</th><th>Matière</th><th>Message</th><th>Statut</th></tr></thead>
                          <tbody>
                            {bookings.map(b => {
                              const st = statusConfig[b.status] || statusConfig.pending;
                              return (
                                <tr key={b.id}>
                                  <td>
                                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                                      <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#6366f1,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:13}}>
                                        {(b.user?.name || 'E').charAt(0)}
                                      </div>
                                      <div>
                                        <div style={{fontWeight:600,color:'#e2e8f0'}}>{b.user?.name || 'Élève'}</div>
                                        <div style={{fontSize:11,color:'#64748b'}}>{b.user?.email || ''}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td style={{color:'#94a3b8'}}>
                                    {new Date(b.date).toLocaleDateString('fr-FR', {day:'numeric',month:'short',year:'numeric'})}
                                  </td>
                                  <td style={{color:'#94a3b8'}}>{b.time || '—'}</td>
                                  <td style={{color:'#94a3b8'}}>{b.subject || '—'}</td>
                                  <td style={{color:'#94a3b8',maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                                    {b.message ? (
                                      <span style={{display:'flex',alignItems:'center',gap:4}}>
                                        <MessageSquare size={12}/> {b.message}
                                      </span>
                                    ) : '—'}
                                  </td>
                                  <td>
                                    <span className="td-badge" style={{background:st.bg,color:st.color}}>
                                      {b.status === 'pending' ? '⏳' : b.status === 'confirmed' ? '✓' : '✗'} {st.label}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* ═══ MON PROFIL ═══ */}
                {activeTab === 'profile' && (
                  <div className="td-card">
                    <div className="td-card-head">
                      <div className="td-card-title"><User size={18} color="#34d399"/> Informations du profil</div>
                      {!editing ? (
                        <button className="td-btn td-btn-green" onClick={() => setEditing(true)}><Edit3 size={14}/> Modifier</button>
                      ) : (
                        <div style={{display:'flex',gap:8}}>
                          <button className="td-btn" onClick={() => { setEditing(false); loadData(); }}>Annuler</button>
                          <button className="td-btn td-btn-green" onClick={handleSaveProfile} disabled={saving}>
                            <Save size={14}/> {saving ? 'Sauvegarde...' : 'Enregistrer'}
                          </button>
                        </div>
                      )}
                    </div>
                    <div style={{padding:24}}>
                      <div className="td-profile-grid">
                        <div className="td-profile-field full" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '10px' }}>
                          <img src={profile.avatar ? '/' + profile.avatar : '/image/prof1.jpg'} alt="Aperçu avatar" style={{ width: 80, height: 80, borderRadius: '16px', objectFit: 'cover', border: '2px solid #34d399' }} />
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Photo de profil (Avatar)</label>
                            {editing ? (
                              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                                <select className="td-input" value={profile.avatar} onChange={e => setProfile({...profile, avatar: e.target.value})}>
                                  <option value="">Sélectionner une photo...</option>
                                  <option value="image/prof1.jpg">Professeur Homme 1 (Souriant)</option>
                                  <option value="image/prof2.jpg">Professeur Homme 2 (Classique)</option>
                                  <option value="image/prof3.jpg">Professeur Homme 3 (Jeune)</option>
                                  <option value="image/prof4.jpg">Professeur Femme 1 (Maths)</option>
                                  <option value="image/prof5.jpg">Professeur Femme 2 (Langues)</option>
                                  <option value="image/prof6.jpg">Professeur Homme 4 (Lunettes)</option>
                                  <option value="image/prof7.jpg">Professeur Femme 3 (Souriante)</option>
                                  <option value="image/prof8.jpg">Professeur Homme 5 (Expérimenté)</option>
                                  <option value="image/prof9.jpg">Professeur Femme 4 (Sérieuse)</option>
                                </select>
                                <input className="td-input" style={{ marginTop: '4px' }} value={profile.avatar} onChange={e => setProfile({...profile, avatar: e.target.value})} placeholder="Ou saisissez un chemin personnalisé, ex: image/prof1.jpg" />
                              </div>
                            ) : (
                              <div style={{ color: '#cbd5e1', fontSize: '13px' }}>
                                {profile.avatar ? `Chemin d'image : ${profile.avatar}` : "Aucune photo personnalisée (avatar par défaut)."}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="td-profile-field">
                          <label><User size={12} style={{display:'inline',verticalAlign:'middle',marginRight:4}}/> Nom complet</label>
                          <input className="td-input" value={profile.name} disabled={!editing} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Votre nom"/>
                        </div>
                        <div className="td-profile-field">
                          <label><MapPin size={12} style={{display:'inline',verticalAlign:'middle',marginRight:4}}/> Ville</label>
                          <input className="td-input" value={profile.city} disabled={!editing} onChange={e => setProfile({...profile, city: e.target.value})} placeholder="ex: Casablanca"/>
                        </div>
                        <div className="td-profile-field">
                          <label><BookOpen size={12} style={{display:'inline',verticalAlign:'middle',marginRight:4}}/> Matières (séparées par virgule)</label>
                          <input className="td-input" value={profile.subjects.join(', ')} disabled={!editing}
                            onChange={e => setProfile({...profile, subjects: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                            placeholder="ex: Maths, Physique"/>
                        </div>
                        <div className="td-profile-field">
                          <label><GraduationCap size={12} style={{display:'inline',verticalAlign:'middle',marginRight:4}}/> Niveau</label>
                          <select className="td-input" value={profile.level} disabled={!editing} onChange={e => setProfile({...profile, level: e.target.value})}>
                            <option value="">Sélectionner...</option>
                            <option value="Primaire">Primaire</option>
                            <option value="Collège">Collège</option>
                            <option value="Lycée">Lycée</option>
                            <option value="Prépa">Prépa</option>
                            <option value="Université">Université</option>
                          </select>
                        </div>
                        <div className="td-profile-field">
                          <label><TrendingUp size={12} style={{display:'inline',verticalAlign:'middle',marginRight:4}}/> Tarif (MAD/h)</label>
                          <input className="td-input" type="number" value={profile.price} disabled={!editing} onChange={e => setProfile({...profile, price: e.target.value})} placeholder="ex: 120"/>
                        </div>
                        <div className="td-profile-field">
                          <label><Briefcase size={12} style={{display:'inline',verticalAlign:'middle',marginRight:4}}/> Expérience</label>
                          <input className="td-input" value={profile.experience} disabled={!editing} onChange={e => setProfile({...profile, experience: e.target.value})} placeholder="ex: 5 ans"/>
                        </div>
                        <div className="td-profile-field">
                          <label><Award size={12} style={{display:'inline',verticalAlign:'middle',marginRight:4}}/> Éducation</label>
                          <input className="td-input" value={profile.education} disabled={!editing} onChange={e => setProfile({...profile, education: e.target.value})} placeholder="ex: Master en Maths"/>
                        </div>
                        <div className="td-profile-field">
                          <label><Globe size={12} style={{display:'inline',verticalAlign:'middle',marginRight:4}}/> Langues (séparées par virgule)</label>
                          <input className="td-input" value={profile.languages.join(', ')} disabled={!editing}
                            onChange={e => setProfile({...profile, languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                            placeholder="ex: Français, Arabe"/>
                        </div>
                        <div className="td-profile-field full">
                          <label><Lightbulb size={12} style={{display:'inline',verticalAlign:'middle',marginRight:4}}/> Méthode d'enseignement</label>
                          <input className="td-input" value={profile.method} disabled={!editing} onChange={e => setProfile({...profile, method: e.target.value})} placeholder="ex: Cours ciblés, exercices, devoirs corrigés"/>
                        </div>
                        <div className="td-profile-field full">
                          <label><MessageSquare size={12} style={{display:'inline',verticalAlign:'middle',marginRight:4}}/> Bio</label>
                          <textarea className="td-input" value={profile.bio} disabled={!editing} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Décrivez-vous en quelques lignes..."/>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ DISPONIBILITÉS ═══ */}
                {activeTab === 'availability' && (
                  <div className="td-card">
                    <div className="td-card-head">
                      <div className="td-card-title"><Clock size={18} color="#34d399"/> Planning hebdomadaire</div>
                    </div>
                    <div>
                      {Object.entries(availability).map(([day, config]) => (
                        <div key={day} className="td-avail-row">
                          <div className="td-avail-day">{dayLabels[day]}</div>
                          <button
                            className={`td-avail-toggle ${config.active ? 'on' : ''}`}
                            onClick={() => setAvailability({...availability, [day]: {...config, active: !config.active}})}
                          />
                          {config.active ? (
                            <div className="td-avail-times">
                              <input className="td-input" type="time" value={config.start}
                                onChange={e => setAvailability({...availability, [day]: {...config, start: e.target.value}})}/>
                              <span style={{color:'#64748b',fontSize:13}}>à</span>
                              <input className="td-input" type="time" value={config.end}
                                onChange={e => setAvailability({...availability, [day]: {...config, end: e.target.value}})}/>
                            </div>
                          ) : (
                            <span style={{color:'#475569',fontSize:13,fontStyle:'italic'}}>Non disponible</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div style={{padding:20,borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',justifyContent:'flex-end'}}>
                      <button className="td-btn td-btn-green" style={{padding:'10px 24px',fontSize:14}} onClick={() => showToast('Disponibilités sauvegardées !', 'success')}>
                        <Save size={14}/> Sauvegarder
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
