"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useTheme } from "./ThemeContext";

// Define auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// Create the context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token storage key
const TOKEN_KEY = "accessToken";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const { forceRefresh } = useTheme();

  // Initialize auth state from localStorage
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  // Login function - store token
  const login = useCallback(
    (newToken: string) => {
      console.log("AuthContext: Login called with token");
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      // Force refresh theme after login to ensure proper application
      console.log("AuthContext: Scheduling theme refresh after login");
      setTimeout(() => {
        console.log("AuthContext: Executing theme refresh after login");
        forceRefresh();
      }, 300); // Increased timeout to ensure DOM is ready
    },
    [forceRefresh]
  );

  // Logout function - clear token
  const logout = useCallback(() => {
    console.log("AuthContext: Logout called");
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    // Force refresh theme after logout to ensure proper application
    console.log("AuthContext: Scheduling theme refresh after logout");
    setTimeout(() => {
      console.log("AuthContext: Executing theme refresh after logout");
      forceRefresh();
    }, 300); // Increased timeout to ensure DOM is ready
  }, [forceRefresh]);

  // Create context value
  const value = {
    isAuthenticated: !!token,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
