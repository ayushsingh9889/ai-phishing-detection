// frontend/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // On mount: if token exists, fetch user info
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await getCurrentUser(token);
          if (res.success) {
            setUser(res.user);
          } else {
            // Invalid token
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
          }
        } catch (err) {
          console.error("Failed to fetch user:", err.message);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []); // only on mount

  const login = async ({ email, password }) => {
    const res = await loginUser({ email, password });
    if (res.success && res.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
      return { success: true };
    }
    return { success: false, message: res.message };
  };

  const register = async ({ name, email, password }) => {
    const res = await registerUser({ name, email, password });
    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
