// context/AuthContext.tsx
"use client";
import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
  } from 'react';
  import { useRouter } from 'next/navigation';
  
  interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
  }
  
  interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
  }
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
  
    useEffect(() => {
      const loadUserFromStorage = async () => {
        try {
          const storedToken = localStorage.getItem('adminToken');
          const storedUser = localStorage.getItem('adminUser');
  
          if (storedToken && storedUser) {
            const parsedUser: User = JSON.parse(storedUser);
            // Optional: Verify token with backend 'me' endpoint for added security
            // For now, we trust local storage
            setToken(storedToken);
            setUser(parsedUser);
          }
        } catch (error) {
          console.error('Failed to load user from storage:', error);
        } finally {
          setLoading(false);
        }
      };
      loadUserFromStorage();
    }, []);
  
    const login = (newToken: string, newUser: User) => {
      localStorage.setItem('adminToken', newToken);
      localStorage.setItem('adminUser', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    };
  
    const logout = () => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setToken(null);
      setUser(null);
      router.push('/admin/login');
    };
  
    const isAuthenticated = !!token && !!user;
  
    return (
      <AuthContext.Provider
        value={{ user, token, isAuthenticated, loading, login, logout }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };