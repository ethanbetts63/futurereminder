import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as api from '@/api';
import type { AuthResponse, UserProfile } from '@/types';

// --- Type Definitions ---
// Using a subset of the UserProfile for the authenticated user object
type AuthUser = Pick<UserProfile, 'id' | 'email' | 'first_name' | 'last_name'>;

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  handleLoginSuccess: (authResponse: AuthResponse) => void;
  logout: () => void;
}

// --- Context Creation ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider Component ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On initial load, try to restore session from localStorage
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decodedUser: AuthUser = jwtDecode(token);
        // Here you might want to add token expiration check
        setUser(decodedUser);
      }
    } catch (error) {
      console.error("Failed to decode token from localStorage", error);
      // If token is corrupt, clear the session
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleAuthFailure = () => {
      console.log("Authentication failure event received. Logging out.");
      logout();
    };

    window.addEventListener('auth-failure', handleAuthFailure);

    return () => {
      window.removeEventListener('auth-failure', handleAuthFailure);
    };
  }, []);

  /**
   * Central handler for successful authentication.
   * Decodes token, sets user state, and persists to localStorage.
   */
  const handleLoginSuccess = (authResponse: AuthResponse) => {
    const { access, refresh } = authResponse;
    const decodedUser: AuthUser = jwtDecode(access);

    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    setUser(decodedUser);
  };

  /**
   * Login handler for the traditional email/password form.
   * It calls the API and then uses handleLoginSuccess on the response.
   */
  const loginWithPassword = async (email: string, password: string) => {
    try {
      const authResponse = await api.loginUser(email, password);
      handleLoginSuccess(authResponse);
    } catch (error) {
      // Clear any partial login data on failure and re-throw for the form to handle
      logout();
      throw error;
    }
  };

  /**
   * Clears user state and removes tokens from localStorage.
   */
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginWithPassword,
    handleLoginSuccess,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
