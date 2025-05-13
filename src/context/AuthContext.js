import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:8081/profile', { withCredentials: true })
      .then((response) => {
        setUser({ name: response.data.name, email: response.data.email });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Auth check error:', error);
        setUser(null);
        setLoading(false);
      });
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    axios
      .post('http://localhost:8081/logout', {}, { withCredentials: true })
      .then(() => {
        setUser(null);
      })
      .catch((err) => console.error('Logout failed:', err));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);