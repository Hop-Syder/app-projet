import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { LoginDto, RegisterDto, User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isStaff: boolean;
  loading: boolean;
  error: string | null;
  login: (data: LoginDto) => Promise<User>;
  register: (data: RegisterDto) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STAFF_ROLES: User['role'][] = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PREPARATEUR', 'LIVREUR'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (data: LoginDto) => {
    setLoading(true);
    setError(null);
    try {
      const auth = await authService.login(data);
      const { access_token, ...rest } = auth;
      setUser(rest);
      return rest;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Identifiants incorrects';
      setError(Array.isArray(message) ? message.join(', ') : message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterDto) => {
    setLoading(true);
    setError(null);
    try {
      const auth = await authService.register(data);
      const { access_token, ...rest } = auth;
      setUser(rest);
      return rest;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Inscription impossible';
      setError(Array.isArray(message) ? message.join(', ') : message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isStaff: !!user && STAFF_ROLES.includes(user.role),
      loading,
      error,
      login,
      register,
      logout,
    }),
    [user, loading, error, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
