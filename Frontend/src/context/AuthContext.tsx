import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, AuthContextType, RegistroFormData } from '../types';
import { mockUsuarios, generarIniciales } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Login simulado
  const login = async (email: string, password: string): Promise<boolean> => {
    // Buscar en mockUsuarios
    const foundUser = mockUsuarios.find(
      (u) => u.email === email && u.password === password
    );

    // Buscar también en usuarios registrados en localStorage
    const storedUsers = localStorage.getItem('registeredUsers');
    let registeredUsers: Usuario[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    const registeredUser = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );

    const authenticatedUser = foundUser || registeredUser;

    if (authenticatedUser) {
      setUser(authenticatedUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
      return true;
    }

    return false;
  };

  // Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  // Registro simulado
  const register = async (userData: Partial<Usuario> & { confirmarPassword: string }): Promise<boolean> => {
    try {
      // Verificar que las contraseñas coincidan
      if (userData.password !== userData.confirmarPassword) {
        return false;
      }

      // Verificar que el email no exista
      const existingUser = mockUsuarios.find((u) => u.email === userData.email);
      if (existingUser) {
        return false;
      }

      // Verificar en usuarios registrados
      const storedUsers = localStorage.getItem('registeredUsers');
      let registeredUsers: Usuario[] = storedUsers ? JSON.parse(storedUsers) : [];
      
      const existingRegisteredUser = registeredUsers.find((u) => u.email === userData.email);
      if (existingRegisteredUser) {
        return false;
      }

      // Crear nuevo usuario
      const newUser: Usuario = {
        id: `${Date.now()}`,
        nombre: userData.nombre || '',
        apellidos: userData.apellidos || '',
        email: userData.email || '',
        password: userData.password || '',
        telefono: userData.telefono || '',
        rol: userData.rol || 'Usuario',
        iniciales: generarIniciales(userData.nombre || '', userData.apellidos || ''),
        estado: 'Activo',
        fechaRegistro: new Date().toISOString().split('T')[0],
        fotoPerfil: userData.fotoPerfil,
      };

      // Guardar en localStorage
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    }
  };

  // Actualizar usuario
  const updateUser = (userData: Partial<Usuario>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Actualizar también en la lista de usuarios registrados
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers) {
        let registeredUsers: Usuario[] = JSON.parse(storedUsers);
        const userIndex = registeredUsers.findIndex((u) => u.id === user.id);
        if (userIndex !== -1) {
          registeredUsers[userIndex] = updatedUser;
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
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

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
