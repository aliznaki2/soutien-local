import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Ajouter le token d'authentification automatiquement
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Tuteurs ───────────────────────────────────────
export const getTutors = (params = {}) => API.get('/tutors', { params });
export const getTutor = (id) => API.get(`/tutors/${id}`);

// ─── Authentification ──────────────────────────────
export const login = (credentials) => API.post('/login', credentials);
export const register = (data) => API.post('/register', data);
export const logout = () => API.post('/logout');
export const getUser = () => API.get('/user');
export const updateProfile = (data) => API.put('/profile', data);
export const forgotPassword = (email) => API.post('/forgot-password', { email });
export const googleLogin = (data) => API.post('/google-login', data);

// ─── Réservations ──────────────────────────────────
export const createBooking = (data) => API.post('/bookings', data);
export const getBookings = () => API.get('/bookings');
export const payBooking = (id, data) => API.post(`/bookings/${id}/pay`, data);

// ─── Avis ──────────────────────────────────────────
export const getReviews = (tutorId) => API.get(`/reviews/${tutorId}`);
export const createReview = (data) => API.post('/reviews', data);

// ─── Dashboard Élève ───────────────────────────────
export const getStudentStats = () => API.get('/student/stats');

// ─── Dashboard Tuteur ──────────────────────────────
export const getTutorStats = () => API.get('/tutor/stats');
export const getTutorBookings = () => API.get('/tutor/bookings');
export const updateTutorProfile = (data) => API.put('/tutor/profile', data);

// ─── Admin ─────────────────────────────────────────
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminBookings = () => API.get('/admin/bookings');
export const updateBookingStatus = (id, status) => API.put(`/admin/bookings/${id}`, { status });

export default API;
