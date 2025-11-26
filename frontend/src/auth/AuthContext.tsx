// src/auth/AuthContext.tsx
import {
    createContext,
    useContext,
    useState,
    type ReactNode,
  } from 'react';
  
  type AuthContextValue = {
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
  };
  
  const AuthContext = createContext<AuthContextValue | undefined>(undefined);
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
  
    const login = async (email: string, password: string) => {
      // TODO: Implement actual login API call
      console.log('Login:', email, password);
      setToken('dummy-token');
    };
  
    const logout = () => {
      setToken(null);
    };
  
    const value: AuthContextValue = {
      token,
      isAuthenticated: !!token,
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