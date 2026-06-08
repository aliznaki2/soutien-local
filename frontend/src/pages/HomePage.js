import React from 'react';
import SearchBar from '../components/SearchBar';
import TutorCard from '../components/TutorCard';
import { Users, Award, Clock } from 'lucide-react';

export default function HomePage({ filtered, handleSearch, openBooking, favorites, toggleFavorite }) {
  const [sortParam, setSortParam] = React.useState('');
  const [priceParam, setPriceParam] = React.useState('');

  const onFilterChange = (e, type) => {
    let s = type === 'sort' ? e.target.value : sortParam;
    let p = type === 'price' ? e.target.value : priceParam;
    if(type === 'sort') setSortParam(s);
    if(type === 'price') setPriceParam(p);
    
    // Call main handleSearch but pass the new fields.
    // The previous subject/city/level are inside SearchBar internal state, 
    // so we pass them via the SearchBar or simply rely on handleSearch to use the new values. 
    // For a simple implementation, we just pass the parameters we know.
    handleSearch({ sortBy: s, maxPrice: p });
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-premium">
        <style>{`
          .hero-premium {
            background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%);
            padding: 80px 24px 100px;
            text-align: center;
            border-bottom-left-radius: 40px;
            border-bottom-right-radius: 40px;
            position: relative;
            overflow: hidden;
          }
          .hero-premium::before {
            content: '';
            position: absolute;
            top: -50%; left: -50%; width: 200%; height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%);
            animation: pulse 15s infinite linear;
          }
          @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
          .hero-content {
            position: relative;
            z-index: 2;
            max-width: 800px;
            margin: 0 auto;
          }
          .hero-title {
            font-size: 3.5rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 20px;
            line-height: 1.1;
            letter-spacing: -1px;
          }
          .hero-title span {
            background: linear-gradient(135deg, var(--accent-primary), #4f46e5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .hero-subtitle {
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 40px;
          }
          @media(max-width:768px){ .hero-title{ font-size: 2.5rem; } }
          
          .stats-section {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 40px;
            flex-wrap: wrap;
          }
          .stat-item {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255,255,255,0.6);
            padding: 12px 24px;
            border-radius: var(--radius-full);
            backdrop-filter: blur(8px);
          }
          .stat-item strong { font-size: 20px; color: var(--text-primary); }
          .stat-item span { color: var(--text-secondary); font-size: 14px; }
          .stat-icon { color: var(--accent-primary); }
        `}</style>
        
        <div className="hero-content animate-fade-up">
          <h1 className="hero-title">L'excellence scolaire <span>à votre portée</span></h1>
          <p className="hero-subtitle">
            Trouvez le tuteur parfait pour vous accompagner vers la réussite. Des profils vérifiés, une pédagogie adaptée, et des résultats garantis.
          </p>
          
          <div className="stats-section">
            <div className="stat-item"><Users className="stat-icon"/> <div><strong>500+</strong> <span>Élèves</span></div></div>
            <div className="stat-item"><Award className="stat-icon"/> <div><strong>4.9/5</strong> <span>Avis moyen</span></div></div>
            <div className="stat-item"><Clock className="stat-icon"/> <div><strong>24/7</strong> <span>Flexibilité</span></div></div>
          </div>
        </div>
      </section>

      <div className="container" style={{ position: 'relative', zIndex: 20 }}>
        <SearchBar onSearch={handleSearch} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, marginTop: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: '28px' }}>Nos Tuteurs d'Élite</h2>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{filtered.length} profil(s) trouvé(s)</span>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <select className="form-input" style={{ width: 'auto', padding: '8px 16px' }} value={sortParam} onChange={(e) => onFilterChange(e, 'sort')}>
              <option value="">Trier par...</option>
              <option value="rating">Mieux notés</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
            </select>
            <select className="form-input" style={{ width: 'auto', padding: '8px 16px' }} value={priceParam} onChange={(e) => onFilterChange(e, 'price')}>
              <option value="">Tous les budgets</option>
              <option value="100">Moins de 100 MAD</option>
              <option value="150">Moins de 150 MAD</option>
              <option value="200">Moins de 200 MAD</option>
            </select>
          </div>
        </div>

        <div className="grid-responsive" aria-live="polite">
          {filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', padding: 60, background: 'white', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{fontSize:40, marginBottom:16}}>🔍</div>
              <h3 style={{marginBottom:8}}>Aucun tuteur trouvé</h3>
              <p style={{color:'var(--text-secondary)'}}>Essayez de modifier vos critères de recherche (Matière, Ville ou Niveau).</p>
            </div>
          ) : filtered.map((t, i) => (
            <TutorCard key={t.id} t={t} index={i} onBook={openBooking} isFavorite={favorites.includes(t.id)} onToggleFavorite={() => toggleFavorite(t.id)} />
          ))}
        </div>
      </div>
    </main>
  );
}
