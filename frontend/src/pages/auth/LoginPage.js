import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, GraduationCap, Eye, EyeOff, X, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { login, forgotPassword, googleLogin } from '../../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated, loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Vue du formulaire : 'login' ou 'forgot-password'
  const [authView, setAuthView] = useState('login');
  
  // Popup Google
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Rediriger si déjà connecté
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ email, password });
      loginUser(res.data.user, res.data.token);
      showToast('Connexion réussie ! Heureux de vous revoir.', 'success');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Erreur de connexion';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Saisissez votre adresse email.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      showToast(res.data.message, 'success');
      setAuthView('login');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Erreur de réinitialisation';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAccountSelect = async (accountEmail, accountName) => {
    setLoading(true);
    setShowGooglePopup(false);
    try {
      const res = await googleLogin({
        email: accountEmail,
        name: accountName,
        google_id: `google_${accountEmail.split('@')[0]}_9988`,
      });
      loginUser(res.data.user, res.data.token);
      showToast(`Connecté avec succès en tant que ${accountName} via Google !`, 'success');
      navigate('/');
    } catch (err) {
      showToast("Échec de l'authentification Google.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleName) {
      showToast('Veuillez remplir tous les champs Google.', 'error');
      return;
    }
    handleGoogleAccountSelect(customGoogleEmail, customGoogleName);
  };

  const googleAccounts = [
    { name: 'Ali Znaki', email: 'ali.znaki@gmail.com', avatar: 'A' },
    { name: 'Walid Bensghir', email: 'walid.bensghir@gmail.com', avatar: 'W' },
    { name: 'Professeur Youssef', email: 'youssef.prof@gmail.com', avatar: 'Y' }
  ];

  return (
    <div className="auth-split-container">
      <style>{`
        .auth-split-container { 
          display: flex; 
          min-height: 100vh; 
          background: #ffffff; 
          font-family: 'Inter', sans-serif; 
          --accent-primary: #0284c7;
          --accent-hover: #0369a1;
          --accent-light: #f0f9ff;
        }
        
        /* Form Column */
        .auth-form-col { flex: 1.2; display: flex; align-items: center; justify-content: center; padding: 40px; position: relative; background: #ffffff; }
        .auth-card { width: 100%; max-width: 440px; }

        /* Staggered entrance animation */
        .stag-0 { animation: authFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .stag-1 { animation: authFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
        .stag-2 { animation: authFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .stag-3 { animation: authFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .stag-4 { animation: authFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
        .stag-5 { animation: authFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards; opacity: 0; }

        .auth-logo { font-size: 24px; font-weight: 800; color: var(--text-primary); margin-bottom: 36px; display: flex; align-items: center; gap: 12px; }
        .auth-logo-badge { width: 42px; height: 42px; background: #e0f2fe; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.12); border: 1px solid rgba(2, 132, 199, 0.15); }
        .auth-logo-text { font-family: 'Outfit', sans-serif; font-weight: 800; background: linear-gradient(135deg, var(--accent-primary), #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        .auth-heading { margin-bottom: 32px; }
        .auth-title { font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; letter-spacing: -0.5px; }
        .auth-subtitle { color: #64748b; font-size: 15px; margin: 0; line-height: 1.5; }

        .auth-input-wrapper { position: relative; }
        .auth-input-wrapper .form-input {
          width: 100%;
          padding: 14px 44px 14px 48px;
          border-radius: 14px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-family: inherit;
          font-size: 15px;
          color: #0f172a;
          transition: all 0.2s ease;
        }
        .auth-input-wrapper .form-input::placeholder {
          color: #94a3b8;
        }
        .auth-input-wrapper .form-input:hover {
          border-color: #cbd5e1;
          background: #ffffff;
        }
        .auth-input-wrapper .form-input:focus {
          outline: none;
          border-color: #0284c7;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.08);
        }
        .auth-input-icon { 
          position: absolute; 
          left: 16px; 
          top: 50%; 
          transform: translateY(-50%); 
          color: #94a3b8; 
          transition: all 0.2s ease; 
          pointer-events: none;
        }
        .auth-input-wrapper:focus-within .auth-input-icon { 
          color: #0284c7; 
        }

        .auth-eye-btn {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .auth-eye-btn:hover {
          color: #0284c7;
        }

        /* Checkbox custom style */
        .auth-options-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; font-size: 14px; }
        .auth-remember-label { display: flex; align-items: center; gap: 8px; color: #475569; cursor: pointer; user-select: none; }
        .auth-remember-checkbox { width: 18px; height: 18px; border-radius: 6px; border: 1.5px solid #cbd5e1; cursor: pointer; accent-color: var(--accent-primary); }
        .auth-forgot-link { color: var(--accent-primary); font-weight: 600; text-decoration: none; transition: all 0.2s; }
        .auth-forgot-link:hover { color: var(--accent-hover); text-decoration: underline; }

        .auth-btn-submit {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 14px;
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 10px 20px -5px rgba(2, 132, 199, 0.3);
          transition: all 0.2s ease;
        }
        .auth-btn-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px -5px rgba(2, 132, 199, 0.4);
          filter: brightness(1.05);
        }
        .auth-btn-submit:active {
          transform: translateY(1px);
        }
        .auth-btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Social login separator */
        .auth-separator { display: flex; align-items: center; text-align: center; color: #94a3b8; font-size: 13px; font-weight: 500; margin: 24px 0; }
        .auth-separator::before, .auth-separator::after { content: ''; flex: 1; border-bottom: 1.5px solid #f1f5f9; }
        .auth-separator:not(:empty)::before { margin-right: 12px; }
        .auth-separator:not(:empty)::after { margin-left: 12px; }

        .auth-social-btn {
          width: 100%;
          padding: 12px 16px;
          border-radius: 14px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
        }
        .auth-social-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #0f172a;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .auth-footer-text { text-align: center; margin-top: 28px; font-size: 14px; color: #64748b; font-weight: 500; }
        .auth-footer-link { color: #0284c7; font-weight: 700; text-decoration: none; transition: all 0.2s; margin-left: 4px; }
        .auth-footer-link:hover { color: #0369a1; text-decoration: underline; }

        /* Image Column */
        .auth-image-col { flex: 1.5; background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #bae6fd 100%); display: flex; flex-direction: column; justify-content: space-between; padding: 60px; position: relative; overflow: hidden; border-left: 1px solid var(--border-light); }
        .auth-image-col::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 70% 30%, rgba(14, 165, 233, 0.08) 0%, transparent 60%); pointer-events: none; }
        
        .auth-illustration-container { display: flex; align-items: center; justify-content: center; flex: 1; margin: 40px 0; }
        .auth-illustration { max-width: 85%; height: auto; border-radius: 20px; box-shadow: 0 20px 40px rgba(14, 165, 233, 0.12); animation: floatAnim 6s ease-in-out infinite; border: 1px solid rgba(14, 165, 233, 0.1); }
        
        .auth-marketing-text { color: #0f172a; position: relative; z-index: 2; max-width: 500px; }
        .auth-marketing-title { font-size: 28px; font-weight: 800; margin-bottom: 12px; line-height: 1.3; color: #0369a1; }
        .auth-marketing-desc { color: #475569; font-size: 15px; line-height: 1.6; margin: 0; }

        /* Google account popup style */
        .g-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; animation: gFadeIn 0.2s ease; }
        .g-popup { background: white; border-radius: 16px; width: 100%; max-width: 440px; box-shadow: 0 24px 60px rgba(0,0,0,0.15); border: 1px solid #e2e8f0; overflow: hidden; animation: gSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .g-header { padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .g-logo { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; color: #1f2937; }
        .g-body { padding: 24px; }
        .g-account-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; border: 1.5px solid #f1f5f9; cursor: pointer; transition: all 0.2s; margin-bottom: 10px; background: #f8fafc; }
        .g-account-item:hover { border-color: #cbd5e1; background: #f1f5f9; transform: translateY(-1px); }
        .g-avatar { width: 36px; height: 36px; border-radius: 50%; background: #0284c7; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
        
        @keyframes authFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatAnim { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
        @keyframes gFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes gSlideUp { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }

        @media (max-width: 960px) {
          .auth-image-col { display: none; }
          .auth-form-col { padding: 40px 24px; }
        }
      `}</style>

      {/* Colonne Gauche - Formulaire */}
      <div className="auth-form-col">
        <div className="auth-card">
          <div className="auth-logo stag-0">
            <div className="auth-logo-badge">
              <GraduationCap size={22} color="#0284c7" />
            </div>
            <span className="auth-logo-text">SoutienLocal</span>
          </div>

          {/* VUE CONNEXION */}
          {authView === 'login' && (
            <>
              <div className="auth-heading stag-1">
                <h1 className="auth-title">Connexion</h1>
                <p className="auth-subtitle">Ravi de vous revoir ! Saisissez vos identifiants pour continuer.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group stag-2">
                  <label className="form-label" style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Adresse Email</label>
                  <div className="auth-input-wrapper">
                    <input 
                      type="email" 
                      required 
                      className="form-input" 
                      placeholder="exemple@email.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                    />
                    <Mail size={18} className="auth-input-icon" />
                  </div>
                </div>

                <div className="form-group stag-3" style={{ marginBottom: 20 }}>
                  <label className="form-label" style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Mot de passe</label>
                  <div className="auth-input-wrapper">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required 
                      className="form-input" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                    />
                    <Lock size={18} className="auth-input-icon" />
                    <button 
                      type="button" 
                      className="auth-eye-btn" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="stag-4" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, marginBottom: 24 }}>
                  <a href="#" className="auth-forgot-link" onClick={(e) => { e.preventDefault(); setAuthView('forgot-password'); }}>
                    Mot de passe oublié ?
                  </a>
                </div>

                <button type="submit" className="auth-btn-submit stag-5" disabled={loading}>
                  {loading ? 'Connexion en cours...' : <><LogIn size={18} /> Se connecter</>}
                </button>
              </form>

              <div className="auth-separator stag-5">ou continuer avec</div>
              <button 
                type="button" 
                className="auth-social-btn stag-5" 
                onClick={() => setShowGooglePopup(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Se connecter avec Google
              </button>

              <div className="auth-footer-text stag-5">
                Nouveau sur la plateforme ? <Link to="/register" className="auth-footer-link">Créer un compte</Link>
              </div>
            </>
          )}

          {/* VUE MOT DE PASSE OUBLIÉ */}
          {authView === 'forgot-password' && (
            <div className="stag-1">
              <div className="auth-heading">
                <h1 className="auth-title" style={{ fontSize: 28 }}>Mot de passe oublié ?</h1>
                <p className="auth-subtitle">Entrez votre email ci-dessous. Le système réinitialisera votre mot de passe et vous donnera accès.</p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Votre adresse email</label>
                  <div className="auth-input-wrapper">
                    <input 
                      type="email" 
                      required 
                      className="form-input" 
                      placeholder="exemple@email.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                    />
                    <Mail size={18} className="auth-input-icon" />
                  </div>
                </div>

                <button type="submit" className="auth-btn-submit" style={{ marginTop: 24 }} disabled={loading}>
                  {loading ? 'Réinitialisation...' : 'Réinitialiser mon mot de passe'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <a href="#" className="auth-footer-link" style={{ fontWeight: 600 }} onClick={(e) => { e.preventDefault(); setAuthView('login'); }}>
                  Retour à la connexion
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Colonne Droite - Image / Marketing */}
      <div className="auth-image-col">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#0f172a' }}>
          <span style={{ fontSize: 24 }}>🚀</span>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 0.5 }}>Rejoignez SoutienLocal</span>
        </div>

        <div className="auth-illustration-container">
          <img 
            src="/image/auth_illustration.png" 
            alt="Soutien Scolaire" 
            className="auth-illustration" 
          />
        </div>

        <div className="auth-marketing-text">
          <h2 className="auth-marketing-title">Apprenez auprès des meilleurs tuteurs locaux</h2>
          <p className="auth-marketing-desc">
            Bénéficiez de cours de soutien personnalisés chez vous ou en ligne, adaptés à votre niveau pour réussir votre parcours scolaire.
          </p>
        </div>
      </div>

      {/* POPUP GOOGLE SIMULÉ */}
      {showGooglePopup && (
        <div className="g-backdrop" onClick={() => setShowGooglePopup(false)}>
          <div className="g-popup" onClick={e => e.stopPropagation()}>
            <div className="g-header">
              <div className="g-logo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Connexion avec Google
              </div>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setShowGooglePopup(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="g-body">
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20, textAlign: 'center' }}>
                Sélectionnez un compte Google de démonstration pour vous connecter instantanément :
              </p>
              
              {googleAccounts.map((account, idx) => (
                <div 
                  key={idx} 
                  className="g-account-item"
                  onClick={() => handleGoogleAccountSelect(account.email, account.name)}
                >
                  <div className="g-avatar">{account.avatar}</div>
                  <div>
                    <strong style={{ display: 'block', fontSize: 14, color: '#1f2937' }}>{account.name}</strong>
                    <span style={{ fontSize: 12, color: '#64748b' }}>{account.email}</span>
                  </div>
                </div>
              ))}
              
              <div style={{ display: 'flex', alignItems: 'center', textTransform: 'uppercase', fontSize: 10, color: '#94a3b8', margin: '20px 0', letterSpacing: 0.5 }}>
                <span style={{ flex: 1, borderBottom: '1px solid #e2e8f0', marginRight: 10 }} />
                ou utiliser un compte personnalisé
                <span style={{ flex: 1, borderBottom: '1px solid #e2e8f0', marginLeft: 10 }} />
              </div>
              
              <form onSubmit={handleCustomGoogleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  <input 
                    type="text" 
                    placeholder="Nom Google" 
                    required
                    className="form-input" 
                    style={{ fontSize: 13, padding: '10px' }}
                    value={customGoogleName}
                    onChange={e => setCustomGoogleName(e.target.value)}
                  />
                  <input 
                    type="email" 
                    placeholder="Adresse Gmail" 
                    required
                    className="form-input" 
                    style={{ fontSize: 13, padding: '10px' }}
                    value={customGoogleEmail}
                    onChange={e => setCustomGoogleEmail(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '10px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  Simuler la connexion de ce compte
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
