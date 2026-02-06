import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useNotification } from './NotificationContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { showNotification } = useNotification();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.data);
          setAuthenticated(true);
        } catch (error) {
          console.error('Session expired or invalid token');
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (identifier, password, remember = false) => {
    try {
      const response = await api.post('/auth/login', { email: identifier, password, remember });
      const { token, user } = response.data.data;
      if (remember) {
        localStorage.setItem('auth_token', token);
      } else {
        sessionStorage.setItem('auth_token', token);
      }
      setUser(user);
      setAuthenticated(true);
      showNotification(`Ravi de vous revoir, ${user.name} !`, 'success');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Identifiants incorrects',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data.data;
      localStorage.setItem('auth_token', token);
      setUser(user);
      setAuthenticated(true);
      showNotification('Bienvenue chez DMC ! Votre compte a été créé.', 'success');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Erreur lors de l'inscription",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      setUser(null);
      setAuthenticated(false);
      showNotification('Vous avez été déconnecté.', 'info');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, authenticated, login, logout, register, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
