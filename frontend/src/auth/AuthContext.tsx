// src/auth/AuthContext.tsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
  } from 'react';
  import { api, ApiError, type CurrentUser } from '../lib/api';
  
  type AuthContextValue = {
    token: string | null;
    user: CurrentUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
  };
  
  const AuthContext = createContext<AuthContextValue | undefined>(undefined);
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() =>
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null
    );
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
  
    // When token changes
    useEffect(() => {
      const init = async () => {
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        try {
          const me = await api.getCurrentUser();
          setUser(me);
        } catch (err) {
          console.error('Failed to fetch current user, clearing token', err);
          localStorage.removeItem('accessToken');
          setToken(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
  
      init();
    }, [token]);
  
    const login = async (email: string, password: string) => {
      const res = await api.login({ email, password });
      localStorage.setItem('accessToken', res.accessToken);
      setToken(res.accessToken);
      // user will be loaded by the effect
    };
  
    const logout = () => {
      localStorage.removeItem('accessToken');
      setToken(null);
      setUser(null);
    };
  
    const value: AuthContextValue = {
      token,
      user,
      isAuthenticated: !!token,
      loading,
      login,
      logout,
    };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }
  
  export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
  }
  