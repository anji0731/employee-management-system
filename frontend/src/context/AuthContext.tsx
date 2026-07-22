import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  role?: {
    id: string;
    name: string;
    code: string;
    description?: string;
  };
  permissions: string[];
  status: string;
  is_temporary_password: boolean;
  first_login: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  hasRole: (roleName: string) => boolean;
  hasPermission: (permissionCode: string) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get<UserProfile>('/auth/me');
      setUser(res.data);
    } catch (err) {
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    const res = await api.post('/auth/login', { email, password, remember_me: rememberMe });
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    await fetchProfile();
  };

  const register = async (email: string, password: string, fullName: string) => {
    const res = await api.post('/auth/register', { email, password, full_name: fullName });
    if (res.data && res.data.access_token) {
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      await fetchProfile();
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      window.location.href = '/login';
    }
  };

  const hasRole = (roleName: string): boolean => {
    if (!user) return false;
    if (user.is_superuser || user.role?.name === 'Super Admin') return true;
    return user.role?.name === roleName;
  };

  const hasPermission = (permissionCode: string): boolean => {
    if (!user) return false;
    if (user.is_superuser || user.role?.name === 'Super Admin') return true;
    return user.permissions.includes(permissionCode);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        hasRole,
        hasPermission,
        refreshProfile: fetchProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
