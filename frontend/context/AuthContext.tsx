import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { buildApiPath } from '../config/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password?: string) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'diwa-hris-auth-user';
const TOKEN_STORAGE_KEY = 'diwa-hris-auth-token';

function readStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    window.sessionStorage.removeItem(key);
    return null;
  }
}

function writeStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

function clearStorage(...keys: string[]): void {
  if (typeof window === 'undefined') return;
  keys.forEach((key) => window.sessionStorage.removeItem(key));
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() =>
    readStorage<User>(USER_STORAGE_KEY),
  );
  const [token, setToken] = useState<string | null>(() =>
    readStorage<string>(TOKEN_STORAGE_KEY),
  );

  const login = useCallback(async (email: string, password?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password?.trim() ?? '';

    if (!trimmedEmail || !trimmedPassword) {
      return null;
    }

    try {
      const response = await fetch(buildApiPath('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      if (!response.ok) {
        return null;
      }

      const payload = (await response.json()) as { user?: User; token?: string };

      if (!payload.user || !payload.token) {
        return null;
      }

      const nextUser: User = {
        ...payload.user,
        employeeId: payload.user.employeeId
          ? String(payload.user.employeeId)
          : undefined,
      };

      writeStorage(USER_STORAGE_KEY, nextUser);
      writeStorage(TOKEN_STORAGE_KEY, payload.token);

      setUser(nextUser);
      setToken(payload.token);
      return nextUser;
    } catch {
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    clearStorage(USER_STORAGE_KEY, TOKEN_STORAGE_KEY);
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated: !!user && !!token,
    }),
    [login, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
