import React, { useState } from 'react';
import { Search, MapPin, BookOpen } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [subject, setSubject] = useState('');
  const [city, setCity] = useState('');
  const [level, setLevel] = useState('');

  function submit(e) { 
    e.preventDefault(); 
    onSearch({ subject, city, level }); 
  }

  return (
    <form className="searchbar-premium animate-fade-up" onSubmit={submit}>
      <style>{`
        .searchbar-premium {
          display: flex;
          background: var(--bg-secondary);
          padding: 10px;
          border-radius: var(--radius-full);
          box-shadow: var(--shadow-lg);
          gap: 8px;
          border: 1px solid var(--border-light);
          align-items: center;
          position: relative;
          z-index: 10;
          margin-top: -35px; /* Floats over hero */
          margin-bottom: 40px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }
        .search-field {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          padding: 8px 16px;
          border-right: 1px solid var(--border-light);
        }
        .search-field:last-child { border: none; }
        .search-field svg { color: var(--accent-primary); }
        .search-input {
          border: none;
          background: transparent;
          font-family: inherit;
          font-size: 15px;
          width: 100%;
          outline: none;
          color: var(--text-primary);
        }
        .search-input::placeholder { color: var(--text-secondary); }
        .search-btn {
          background: var(--accent-primary);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: var(--radius-full);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .search-btn:hover { background: var(--accent-hover); transform: scale(1.02); }
        @media(max-width: 768px){
          .searchbar-premium { flex-direction: column; border-radius: var(--radius-md); padding: 16px; gap: 16px; }
          .search-field { border-right: none; border-bottom: 1px solid var(--border-light); padding-bottom: 12px; width: 100%; }
          .search-btn { width: 100%; justify-content: center; }
        }
      `}</style>
      
      <div className="search-field">
        <BookOpen size={20} />
        <input type="text" className="search-input" placeholder="Matière (ex: Maths)" value={subject} onChange={e => setSubject(e.target.value)} />
      </div>
      
      <div className="search-field">
        <MapPin size={20} />
        <input type="text" className="search-input" placeholder="Ville ou Code Postal" value={city} onChange={e => setCity(e.target.value)} />
      </div>

      <div className="search-field">
        <select className="search-input" style={{cursor: 'pointer'}} value={level} onChange={e => setLevel(e.target.value)}>
          <option value="">Tous les niveaux</option>
          <option>Primaire</option>
          <option>Collège</option>
          <option>Lycée</option>
          <option>Prépa</option>
          <option>Université</option>
        </select>
      </div>

      <button type="submit" className="search-btn"><Search size={18} /> Rechercher</button>
    </form>
  );
}
