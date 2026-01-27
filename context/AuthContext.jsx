import React, { createContext, useContext, useState, useEffect } from "react";
import { getTokenCookie, getUserIdCookie, getUsernameCookie } from "../utils/cookies";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    userId: null,
    username: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  // ตรวจสอบ cookies เมื่อ component mount
  useEffect(() => {
    const token = getTokenCookie();
    const userId = getUserIdCookie();
    const username = getUsernameCookie();

    setAuth({
      token: token || null,
      userId: userId || null,
      username: username || null,
      isAuthenticated: !!token,
    });
    setLoading(false);
  }, []);

  const login = (token, userId, username) => {
    setAuth({
      token,
      userId,
      username,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    setAuth({
      token: null,
      userId: null,
      username: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
