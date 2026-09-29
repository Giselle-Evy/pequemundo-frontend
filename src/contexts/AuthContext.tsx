import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import type { User, AuthResponse } from '../types';

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('pequemundo_token');
    const savedUser = localStorage.getItem('pequemundo_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<User> {
    const response = await api.post<AuthResponse>('/login', { email, password });
    const { user, token } = response.data;

    localStorage.setItem('pequemundo_token', token);
    localStorage.setItem('pequemundo_user', JSON.stringify(user));

    setUser(user);
    setToken(token);
    return user;
  }

  async function register(name: string, email: string, password: string) {
    const response = await api.post<AuthResponse>('/register', { name, email, password });
    const { user, token } = response.data;

    localStorage.setItem('pequemundo_token', token);
    localStorage.setItem('pequemundo_user', JSON.stringify(user));

    setUser(user);
    setToken(token);
  }

  async function logout() {
    try {
      await api.post('/logout');
    } catch {
      // ignorar errores
    }
    localStorage.removeItem('pequemundo_token');
    localStorage.removeItem('pequemundo_user');
    localStorage.removeItem('pequemundo_child');
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}