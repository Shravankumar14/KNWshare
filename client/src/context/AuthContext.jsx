import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('knwshare_token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        } catch (err) {
          console.error('Failed to load user profile with existing token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const payload = res.data;
    const newToken = payload.token || payload.data?.token;
    const userData = payload.user || payload.data?.user || (payload.data ? { ...payload.data } : null);
    if (userData && userData.token) {
      delete userData.token;
    }
    localStorage.setItem('knwshare_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const googleLogin = async (credential) => {
    const res = await api.post('/auth/google', { credential });
    const payload = res.data;
    const newToken = payload.token || payload.data?.token;
    const userData = payload.user || payload.data?.user || (payload.data ? { ...payload.data } : null);
    if (userData && userData.token) {
      delete userData.token;
    }
    localStorage.setItem('knwshare_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, extra = {}) => {
    const res = await api.post('/auth/register', { name, email, password, ...extra });
    const payload = res.data;
    const newToken = payload.token || payload.data?.token;
    const userData = payload.user || payload.data?.user || (payload.data ? { ...payload.data } : null);
    if (userData && userData.token) {
      delete userData.token;
    }
    localStorage.setItem('knwshare_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('knwshare_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data);
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        googleLogin,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
