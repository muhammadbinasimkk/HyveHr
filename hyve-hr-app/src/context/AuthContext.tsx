// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  currentUser: any; // Replace 'any' with your user type
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthorized: (role: string) => boolean;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  // Function to handle login
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;

      setCurrentUser(user); // Set the current user
      localStorage.setItem('accessToken', accessToken); // Store access token
      localStorage.setItem('refreshToken', refreshToken); // Store refresh token

      navigate('/home'); // Redirect to home after successful login
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    }
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setCurrentUser(null);
    navigate('/login');
  };

  // Function to check if the user is authorized for a specific role
  const isAuthorized = (role: string) => {
    return currentUser?.role === role;
  };

  // Function to refresh access token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      logout(); // If no refresh token, logout
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/token', { token: refreshToken });
      localStorage.setItem('accessToken', response.data.accessToken); // Update access token
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout(); // If refresh fails, log out the user
    }
  };

  // Automatically refresh access token every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 15 * 60 * 1000); // Refresh token every 15 minutes

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthorized, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
