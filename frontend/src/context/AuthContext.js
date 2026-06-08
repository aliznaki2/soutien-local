import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un token existe au chargement
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
