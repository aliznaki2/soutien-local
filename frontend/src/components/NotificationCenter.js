import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle, Clock, XCircle, X } from 'lucide-react';

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('sl_notifs');
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'info', title: 'Bienvenue sur SoutienLocal !', message: 'Explorez nos tuteurs et réservez votre première séance.', time: 'Maintenant', read: false },
      { id: 2, type: 'success', title: 'Inscription réussie', message: 'Votre compte a été créé avec succès.', time: 'Il y a 1 min', read: false },
    ];
  });
  const ref = useRef();

  useEffect(() => {
    localStorage.setItem('sl_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unread = notifications.filter(n => !n.read).length;
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const removeNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  const iconMap = {
    info: <Bell size={16} color="#3b82f6"/>,
    success: <CheckCircle size={16} color="#10b981"/>,
    warning: <Clock size={16} color="#f59e0b"/>,
    error: <XCircle size={16} color="#ef4444"/>,
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        position: 'relative', background: 'none', border: 'none', cursor: 'pointer',
        padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center',
        color: 'var(--text-secondary)', transition: 'all 0.2s',
      }}>
        <Bell size={20} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            width: 18, height: 18, borderRadius: '50%',
            background: '#ef4444', color: 'white', fontSize: 10,
            fontWeight: 700, display: 'flex', alignItems: 'center',
            justifyContent: 'center', border: '2px solid white',
          }}>{unread}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 8,
          width: 360, background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          border: '1px solid var(--border-light)', zIndex: 100,
          animation: 'slideUp 0.2s ease',
        }}>
          <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
            <h4 style={{ fontWeight: 700, fontSize: 15 }}>Notifications</h4>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                Tout marquer lu
              </button>
            )}
          </div>

          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
                🔔 Aucune notification
              </div>
            ) : notifications.map(n => (
              <div key={n.id} style={{
                display: 'flex', gap: 12, padding: '14px 20px',
                borderBottom: '1px solid var(--border-light)',
                background: n.read ? 'transparent' : 'var(--accent-light)',
                transition: 'all 0.2s',
              }}>
                <div style={{ marginTop: 2 }}>{iconMap[n.type] || iconMap.info}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, opacity: 0.7 }}>{n.time}</div>
                </div>
                <button onClick={() => removeNotif(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 2 }}>
                  <X size={14}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
