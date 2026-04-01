import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import api from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lms_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('lms_token', token);
      localStorage.setItem('lms_user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      console.error('Login error:', message);
      return { success: false, message };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      const { token, user } = res.data;
      localStorage.setItem('lms_token', token);
      localStorage.setItem('lms_user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      console.error('Register error:', message);
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}