import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUserRequest, loginRequest, signupRequest } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('pharmatec_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUserRequest();
        setUser(response.user);
      } catch (error) {
        localStorage.removeItem('pharmatec_token');
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (payload) => {
    const response = await loginRequest(payload);
    localStorage.setItem('pharmatec_token', response.token);
    setUser(response.user);
    return response.user;
  };

  const signup = async (payload) => {
    const response = await signupRequest(payload);
    localStorage.setItem('pharmatec_token', response.token);
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    localStorage.removeItem('pharmatec_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
