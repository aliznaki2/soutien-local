import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, Info, GraduationCap, User, CalendarCheck, Heart, BarChart2, MessageSquare, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { logout as apiLogout } from '../services/api';
import NotificationCenter from './NotificationCenter';

export default function Header() {
  const { user, logoutUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {
      // Token peut être invalide
    }
    logoutUser();
    showToast('Déconnexion réussie. À bientôt !', 'info');
    navigate('/login');
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-light)' }}>
      <div className="container nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 70 }}>
        <Link to="/" className="logo">
          <div className="mark"><GraduationCap size={24} /></div>
          <div>
            <div className="logo-text-top">Apprentissage</div>
            <div className="logo-text-bottom">SoutienLocal</div>
          </div>
        </Link>

        <nav className="nav-links" style={{ display: 'flex', gap: 24 }}>
          <NavLink to="/how-it-works" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} style={{display: 'flex', alignItems: 'center', gap: 6}}>
            <Info size={18} /> Comment ça marche
          </NavLink>
          <NavLink to="/become-tutor" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} style={{display: 'flex', alignItems: 'center', gap: 6}}>
            <BookOpen size={18} /> Devenir tuteur
          </NavLink>
          <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} style={{display: 'flex', alignItems: 'center', gap: 6}}>
            <User size={18} /> Tuteurs
          </NavLink>
        </nav>

        <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
          {user && <NotificationCenter />}
          
          {user ? (
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{
                display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)', padding: '6px 12px', borderRadius: 'var(--radius-full)',
                cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)', transition: 'all 0.2s'
              }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                  {user.name?.charAt(0) || 'U'}
                </div>
                {user.name?.split(' ')[0]}
                <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 220,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
                  animation: 'slideUp 0.2s ease', zIndex: 100
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user.email}</div>
                  </div>
                  
                  <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }} className="menu-item-hover">
                      <BarChart2 size={16} color="var(--accent-primary)" /> Mon Tableau de bord
                    </Link>
                    {user?.role === 'tutor' && (
                      <Link to="/tutor-dashboard" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }} className="menu-item-hover">
                        <GraduationCap size={16} color="#10b981" /> Mon Espace Tuteur
                      </Link>
                    )}
                    <Link to="/my-bookings" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }} className="menu-item-hover">
                      <CalendarCheck size={16} color="#8b5cf6" /> Mes Réservations
                    </Link>
                    <Link to="/favorites" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }} className="menu-item-hover">
                      <Heart size={16} color="#ef4444" /> Mes Favoris
                    </Link>
                    <Link to="/chat" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }} className="menu-item-hover">
                      <MessageSquare size={16} color="#10b981" /> Messagerie
                    </Link>
                    <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }} className="menu-item-hover">
                      <User size={16} color="#f59e0b" /> Mon Profil
                    </Link>
                    
                    <div style={{ height: 1, background: 'var(--border-light)', margin: '4px 0' }} />
                    
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 'var(--radius-md)', color: '#ef4444', textDecoration: 'none', fontSize: 14, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }} className="menu-item-hover-danger">
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                  <style>{`
                    .menu-item-hover:hover { background: var(--bg-primary); }
                    .menu-item-hover-danger:hover { background: #fee2e2; }
                  `}</style>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Connexion</Link>
              <Link to="/register" className="btn btn-primary">Inscription</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
