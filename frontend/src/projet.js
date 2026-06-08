import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './projet.css';
import { TUTORS } from './data/tutors';
import { getTutors } from './services/api';
import Header from './components/Header';
import BookingModal from './components/BookingModal';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import TutorRoute from './components/TutorRoute';
import { useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HowItWorksPage from './pages/info/HowItWorksPage';
import BecomeTutorPage from './pages/info/BecomeTutorPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import TutorDashboard from './pages/TutorDashboard';
import MyBookingsPage from './pages/MyBookingsPage';
import UserProfilePage from './pages/UserProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import StudentDashboard from './pages/StudentDashboard';
import ChatPage from './pages/ChatPage';
import { useToast } from './context/ToastContext';

export default function App() {
  const [tutors, setTutors] = useState(TUTORS);
  const [filtered, setFiltered] = useState(TUTORS);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookTutor, setBookTutor] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Charger les tuteurs depuis l'API Laravel (fallback sur données locales)
  useEffect(() => {
    getTutors()
      .then(res => {
        const data = res.data.data || res.data;
        if (Array.isArray(data) && data.length > 0) {
          setTutors(data);
          setFiltered(data);
        }
      })
      .catch(() => {
        console.log('API non disponible, utilisation des données locales');
      });
  }, []);

  function handleSearch({ subject, city, level, sortBy, maxPrice }) {
    const s = (subject || '').trim().toLowerCase();
    const c = (city || '').trim().toLowerCase();
    
    let results = tutors.filter(t => {
      const subjects = Array.isArray(t.subjects) ? t.subjects : JSON.parse(t.subjects || '[]');
      const bySubject = s === '' || subjects.join(' ').toLowerCase().includes(s);
      const byCity = c === '' || t.city.toLowerCase().includes(c);
      const byLevel = !level || level === '' || t.level === level;
      const byPrice = !maxPrice || t.price <= maxPrice;
      return bySubject && byCity && byLevel && byPrice;
    });

    if (sortBy === 'rating') results.sort((a,b) => b.rating - a.rating);
    if (sortBy === 'price_asc') results.sort((a,b) => a.price - b.price);
    if (sortBy === 'price_desc') results.sort((a,b) => b.price - a.price);

    setFiltered(results);
    if(window.location.pathname !== '/') navigate('/');
  }

  function toggleFavorite(id) {
    if(favorites.includes(id)) {
      setFavorites(favorites.filter(x => x !== id));
      showToast('Retiré de vos favoris', 'info');
    } else {
      setFavorites([...favorites, id]);
      showToast('Ajouté à vos favoris avec succès ❤️', 'success');
    }
  }

  function openBooking(id) { 
    const t = tutors.find(x => x.id === id); 
    setBookTutor(t); 
    setBookingOpen(true); 
  }
  
  function confirmBooking(booking) { 
    showToast(`Réservation validée pour ${bookTutor.name} le ${booking.date}`, 'success'); 
    setBookingOpen(false); 
  }

  const isAdmin = user?.role === 'admin';

  return (
    <>
      {isAuthenticated && <Header />}
      
      <div className="page-wrapper">
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes protégées */}
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage 
                filtered={filtered} 
                handleSearch={handleSearch} 
                openBooking={openBooking} 
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            </ProtectedRoute>
          } />
          <Route path="/profile/:id" element={
            <ProtectedRoute>
              <ProfilePage tutors={tutors} openBooking={openBooking} />
            </ProtectedRoute>
          } />
          <Route path="/how-it-works" element={
            <ProtectedRoute>
              <HowItWorksPage />
            </ProtectedRoute>
          } />
          <Route path="/become-tutor" element={
            <ProtectedRoute>
              <BecomeTutorPage />
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute>
              <FavoritesPage tutors={tutors} favorites={favorites} toggleFavorite={toggleFavorite} openBooking={openBooking} />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />

          {/* Route tuteur — réservée aux tuteurs */}
          <Route path="/tutor-dashboard" element={
            <TutorRoute>
              <TutorDashboard />
            </TutorRoute>
          } />

          {/* Route admin — réservée aux admins */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard tutors={tutors} />
            </AdminRoute>
          } />
        </Routes>
      </div>

      {isAuthenticated && (
        <footer className="footer animate-fade-up delay-300">
          <div className="container" style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12}}>
            <p>© {new Date().getFullYear()} <strong>SoutienLocal</strong> — E-Learning Excellence.</p>
            {/* Lien admin visible UNIQUEMENT pour les admins */}
            {isAdmin && (
              <a href="/admin" style={{fontSize:13, color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:6, textDecoration:'none'}}>
                🔐 Espace Administrateur
              </a>
            )}
          </div>
        </footer>
      )}

      <BookingModal visible={bookingOpen} tutor={bookTutor} onClose={() => setBookingOpen(false)} onConfirm={confirmBooking} />
    </>
  );
}
