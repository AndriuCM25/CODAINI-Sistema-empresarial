import React, { createContext, useContext, useState } from 'react';
import { Usuario, AuthContextType } from '../types';
import { authService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        return JSON.parse(storedUser);
      }
    } catch {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('token');
      return Boolean(storedUser && storedToken);
    } catch {
      return false;
    }
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      const { token, user: userData } = response;

      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Correo o contraseña incorrectos';
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('registeredUsers');
  };

  const register = async (
    userData: Partial<Usuario> & { confirmarPassword: string }
  ): Promise<boolean> => {
    try {
      const { confirmarPassword, ...payload } = userData;
      await authService.register(payload);
      return true;
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'No se pudo crear la cuenta';
      throw new Error(message);
    }
  };

  const updateUser = async (userData: Partial<Usuario>): Promise<void> => {
    try {
      if (user) {
        const response = await authService.updateUser(userData);
        const updatedUser = response;

        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    } catch {
      setUser((prev) => (prev ? { ...prev, ...userData } : prev));
      if (user) {
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    updateUser,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
