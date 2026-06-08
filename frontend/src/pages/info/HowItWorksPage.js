import React from 'react';
import { Search, CalendarCheck, Video, LineChart } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    { icon: <Search size={32}/>, title: "Trouve ton tuteur", desc: "Recherche par matière, niveau ou ville. Consulte les profils des tuteurs avec leurs avis et tarifs.", color: "#3b82f6" },
    { icon: <CalendarCheck size={32}/>, title: "Réserve facilement", desc: "Choisis la date et l’heure de ton choix. Tu peux régler en ligne de manière sécurisée.", color: "#10b981" },
    { icon: <Video size={32}/>, title: "Apprends à ton rythme", desc: "Reçois ton cours en visio ou en présentiel selon ton choix. Laisse une évaluation après la séance.", color: "#8b5cf6" },
    { icon: <LineChart size={32}/>, title: "Progresse sereinement", desc: "Accède à ton tableau de bord pour suivre tes progrès, tes notes et les matières travaillées.", color: "#f59e0b" }
  ];

  return (
    <div className="container animate-fade-up" style={{ padding: '60px 24px', maxWidth: 900 }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Comment ça marche ?</h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)' }}>Un processus simple en 4 étapes pour atteindre l'excellence éducative.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-secondary)', padding: 32, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 120, fontWeight: 900, color: s.color, opacity: 0.05, lineHeight: 1 }}>{i+1}</div>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              {s.icon}
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 12 }}>{i+1}. {s.title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
