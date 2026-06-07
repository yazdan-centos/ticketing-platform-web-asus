import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Helper functions to manage sessionStorage
  const getSessionValue = (key) => sessionStorage.getItem(key) || null;
  const setSessionValue = (key, value) => {
    if (value) {
      sessionStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    } else {
      sessionStorage.removeItem(key);
    }
  };

  // Initialize state directly from sessionStorage to prevent flash of unauthenticated state
  const [accessToken, setAccessToken] = useState(() => getSessionValue('accessToken'));
  const [role, setRole] = useState(() => getSessionValue('role'));
  const [currentUser, setCurrentUser] = useState(() => {
    const user = sessionStorage.getItem('currentUser');
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });

  // Sync state changes to sessionStorage
  useEffect(() => {
    setSessionValue('accessToken', accessToken);
  }, [accessToken]);

  useEffect(() => {
    setSessionValue('role', role);
  }, [role]);

  useEffect(() => {
    setSessionValue('currentUser', currentUser);
  }, [currentUser]);

  // Login function to set all auth data
  const login = (token, user, userRole) => {
    setAccessToken(token);
    setCurrentUser(user);
    setRole(userRole);
  };

  // Logout function to clear all auth data
  const logout = () => {
    setAccessToken(null);
    setCurrentUser(null);
    setRole(null);
    sessionStorage.clear();
  };

  // Check if user is authenticated
  const isAuthenticated = !!accessToken;

  const value = {
    accessToken,
    currentUser,
    role,
    isAuthenticated,
    login,
    logout,
    setAccessToken,
    setCurrentUser,
    setRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to expose the auth context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
