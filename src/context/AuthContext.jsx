import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null); // Add userId state

  const login = (id) => {
    setIsAuthenticated(true);
    setUserId(id); // Set the userId
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null); // Clear userId on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userId }}> {/* Provide userId */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
