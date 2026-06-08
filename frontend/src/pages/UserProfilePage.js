import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, Save, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateProfile } from '../services/api';

export default function ProfilePage() {
  const { user, loginUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwForm, setPwForm] = useState({ password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const handleChange = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile(form);
      const token = localStorage.getItem('auth_token');
      loginUser(res.data.user, token);
      showToast('Profil mis à jour !', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur', 'error');
    } finally { setLoading(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.password.length < 6) { showToast('Le mot de passe doit contenir au moins 6 caractères', 'error'); return; }
    setPwLoading(true);
    try {
      await updateProfile(pwForm);
      showToast('Mot de passe modifié !', 'success');
      setPwForm({ password: '', password_confirmation: '' });
    } catch (err) {
      showToast(err.response?.data?.errors?.password?.[0] || 'Erreur', 'error');
    } finally { setPwLoading(false); }
  };

  const initials = (user?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase();
  const roleLabel = user?.role === 'admin' ? 'Administrateur' : user?.role === 'tutor' ? 'Tuteur' : 'Élève';

  return (
    <div className="container animate-fade-up" style={{ padding: '32px 24px', maxWidth: 700 }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ padding: 0, marginBottom: 16 }}>
        <ArrowLeft size={18} /> Retour
      </button>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Mon Profil</h1>

      {/* Avatar + Infos */}
      <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:32, padding:24, background:'var(--bg-secondary)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border-light)' }}>
        <div style={{ width:72, height:72, borderRadius:18, background:'linear-gradient(135deg,var(--accent-primary),#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:28, fontWeight:800 }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize:20, fontWeight:700 }}>{user?.name}</div>
          <div style={{ color:'var(--text-secondary)', fontSize:14, marginTop:2 }}>{user?.email}</div>
          <span style={{ display:'inline-flex', alignItems:'center', gap:4, marginTop:8, padding:'4px 12px', borderRadius:20, background:'var(--accent-light)', color:'var(--accent-primary)', fontSize:12, fontWeight:700 }}>
            <Shield size={12}/> {roleLabel}
          </span>
        </div>
      </div>

      {/* Form Infos */}
      <div style={{ background:'var(--bg-secondary)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border-light)', padding:28, marginBottom:24 }}>
        <h3 style={{ fontSize:17, fontWeight:700, marginBottom:20, display:'flex', alignItems:'center', gap:8 }}>
          <User size={18} color="var(--accent-primary)"/> Informations personnelles
        </h3>
        <form onSubmit={saveProfile}>
          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <div style={{position:'relative'}}>
              <User size={16} style={{position:'absolute',left:14,top:14,color:'var(--text-secondary)'}}/>
              <input className="form-input" style={{paddingLeft:40}} value={form.name} onChange={handleChange('name')} required/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{position:'relative'}}>
              <Mail size={16} style={{position:'absolute',left:14,top:14,color:'var(--text-secondary)'}}/>
              <input type="email" className="form-input" style={{paddingLeft:40}} value={form.email} onChange={handleChange('email')} required/>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{display:'flex',alignItems:'center',gap:8}} disabled={loading}>
            {loading ? 'Enregistrement...' : <><Save size={16}/> Enregistrer</>}
          </button>
        </form>
      </div>

      {/* Form Password */}
      <div style={{ background:'var(--bg-secondary)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border-light)', padding:28 }}>
        <h3 style={{ fontSize:17, fontWeight:700, marginBottom:20, display:'flex', alignItems:'center', gap:8 }}>
          <Lock size={18} color="var(--accent-primary)"/> Changer le mot de passe
        </h3>
        <form onSubmit={changePassword}>
          <div className="form-group">
            <label className="form-label">Nouveau mot de passe</label>
            <input type="password" className="form-input" placeholder="••••••••" value={pwForm.password} onChange={e => setPwForm({...pwForm, password: e.target.value})} required/>
          </div>
          <div className="form-group">
            <label className="form-label">Confirmer</label>
            <input type="password" className="form-input" placeholder="••••••••" value={pwForm.password_confirmation} onChange={e => setPwForm({...pwForm, password_confirmation: e.target.value})} required/>
          </div>
          <button type="submit" className="btn btn-outline" style={{display:'flex',alignItems:'center',gap:8}} disabled={pwLoading}>
            {pwLoading ? 'Modification...' : <><CheckCircle size={16}/> Modifier le mot de passe</>}
          </button>
        </form>
      </div>
    </div>
  );
}
