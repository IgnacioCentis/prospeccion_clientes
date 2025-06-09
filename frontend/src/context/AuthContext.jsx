import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';
import { setToken, clearToken, getToken } from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setT] = useState(getToken());

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    setToken(res.data.token); setT(res.data.token);
  };

  const logout = () => { clearToken(); setT(null); };

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);