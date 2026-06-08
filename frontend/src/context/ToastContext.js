import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 3s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <style>{`
          .toast-enter { animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes toastIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          .toast-success { background: var(--bg-secondary); border-left: 4px solid var(--success); }
          .toast-error { background: var(--bg-secondary); border-left: 4px solid var(--danger); }
          .toast-info { background: var(--bg-secondary); border-left: 4px solid var(--accent-primary); }
        `}</style>
        {toasts.map(t => (
          <div key={t.id} className={`toast-enter toast-\${t.type}`} style={{ padding: '16px 24px', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)', minWidth: 250, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{fontWeight: 600, fontSize: 15}}>{t.message}</span>
            <button onClick={() => removeToast(t.id)} style={{background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', marginLeft: 16}}>✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
