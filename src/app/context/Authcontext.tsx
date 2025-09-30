// // context/AuthContext.tsx
// "use client";
// import React, {
//     createContext,
//     useState,
//     useEffect,
//     useContext,
//     ReactNode,
//   } from 'react';
//   import { useRouter } from 'next/navigation';
  
//   interface User {
//     id: string;
//     email: string;
//     name?: string;
//     role: string;
//   }
  
//   interface AuthContextType {
//     user: User | null;
//     token: string | null;
//     isAuthenticated: boolean;
//     loading: boolean;
//     login: (accessToken: string, newUser: User, newRefreshToken: string) => void;
//     logout: () => void;
//   }
  
//   const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
//   interface AuthProviderProps {
//     children: ReactNode;
//   }
  
//   export const AuthProvider = ({ children }: AuthProviderProps) => {
//     const [user, setUser] = useState<User | null>(null);
//     const [token, setToken] = useState<string | null>(null);
//     const [refreshToken, setRefreshToken] = useState<string | null>(null);
//     const [loading, setLoading] = useState(true);
//     const router = useRouter();
  
//     useEffect(() => {
//       const loadUserFromStorage = async () => {
//         try {
//           const storedToken = localStorage.getItem('adminToken');
//           const storedRefresh = localStorage.getItem('adminRefreshToken');
//           const storedUser = localStorage.getItem('adminUser');
  
//           if (storedToken && storedUser&& storedRefresh) {
//             const parsedUser: User = JSON.parse(storedUser);
//             // Optional: Verify token with backend 'me' endpoint for added security
//             // For now, we trust local storage
//             setToken(storedToken);
//             setRefreshToken(storedRefresh);
//             setUser(parsedUser);
//           }
//         } catch (error) {
//           console.error('Failed to load user from storage:', error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       loadUserFromStorage();
//     }, []);
  
//     const login = (accessToken: string, newUser: User, newRefreshToken: string) => {
//       localStorage.setItem('adminToken', accessToken);
//       localStorage.setItem('adminRefreshToken', newRefreshToken);
//       localStorage.setItem('adminUser', JSON.stringify(newUser));

//       setToken(accessToken);
//       setRefreshToken(newRefreshToken);
//       setUser(user);
//     };
  
//     const logout = () => {
//       localStorage.removeItem('adminToken');
//       localStorage.removeItem('adminRefreshToken');
//       localStorage.removeItem('adminUser');
//       setToken(null);
//       setRefreshToken(null);
//       setUser(null);
//       router.push('/admin/login');
//     };
  
//     const isAuthenticated = !!token && !!user;
  
//     return (
//       <AuthContext.Provider
//         value={{ user, token, isAuthenticated, loading, login, logout }}
//       >
//         {children}
//       </AuthContext.Provider>
//     );
//   };
  
//   export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (context === undefined) {
//       throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
//   };
"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
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
  login: (accessToken: string, user: User, refreshToken: string) => void;
  logout: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedRefresh = localStorage.getItem('adminRefreshToken');
    const storedUser = localStorage.getItem('adminUser');

    if (storedToken && storedRefresh && storedUser) {
      setToken(storedToken);
      setRefreshToken(storedRefresh);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (accessToken: string, user: User, newRefreshToken: string) => {
    localStorage.setItem('adminToken', accessToken);
    localStorage.setItem('adminRefreshToken', newRefreshToken);
    localStorage.setItem('adminUser', JSON.stringify(user));

    setToken(accessToken);
    setRefreshToken(newRefreshToken);
    setUser(user);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminUser');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    router.push('/admin/login');
  };

  // Refresh access token
  const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshToken) return null;

    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken }),
      });
      const data = await res.json();
      if (res.ok && data.accessToken) {
        localStorage.setItem('adminToken', data.accessToken);
        setToken(data.accessToken);
        return data.accessToken;
      } else {
        logout();
        return null;
      }
    } catch (err) {
      console.error('Refresh token failed:', err);
      logout();
      return null;
    }
  };

  // Wrapper to automatically handle token expiration
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let accessToken = token;

    let res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 401) {
      // Token expired → refresh
      accessToken = await refreshAccessToken();
      if (!accessToken) throw new Error('Session expired');

      // Retry original request
      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return res;
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, loading, login, logout, fetchWithAuth }}
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
