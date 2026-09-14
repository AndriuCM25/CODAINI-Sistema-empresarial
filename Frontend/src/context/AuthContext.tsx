import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, AuthContextType } from '../types';
import { mockUsuarios, generarIniciales } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ============================================================
  // CARGAR SESIÓN ACTUAL
  // ============================================================
  useEffect(() => {

    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      try {
        const parsedUser: Usuario = JSON.parse(storedUser);

        setUser(parsedUser);
        setIsAuthenticated(true);

      } catch (error) {
        console.error('Error al cargar currentUser:', error);
        localStorage.removeItem('currentUser');
      }
    }

  }, []);

  // ============================================================
  // OBTENER PERFIL GUARDADO DEL USUARIO
  // ============================================================
  const obtenerPerfilGuardado = (email: string): Partial<Usuario> | null => {

    const key = `profile_${email}`;

    const storedProfile = localStorage.getItem(key);

    if (!storedProfile) {
      return null;
    }

    try {
      return JSON.parse(storedProfile);
    } catch (error) {
      console.error('Error al leer perfil:', error);
      return null;
    }
  };

  // ============================================================
  // GUARDAR PERFIL DEL USUARIO
  // ============================================================
  const guardarPerfil = (usuario: Usuario) => {

    const key = `profile_${usuario.email}`;

    localStorage.setItem(
      key,
      JSON.stringify(usuario)
    );
  };

  // ============================================================
  // LOGIN
  // ============================================================
  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {

    // Buscar en mockUsuarios
    const foundUser = mockUsuarios.find(
      (u) => u.email === email && u.password === password
    );

    // Buscar también en usuarios registrados
    const storedUsers = localStorage.getItem('registeredUsers');

    const registeredUsers: Usuario[] = storedUsers
      ? JSON.parse(storedUsers)
      : [];

    const registeredUser = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );

    const authenticatedUser = foundUser || registeredUser;

    if (authenticatedUser) {

      // Buscar si este usuario ya tiene un perfil guardado
      const perfilGuardado = obtenerPerfilGuardado(
        authenticatedUser.email
      );

      // Combinar usuario original + cambios del perfil
      const usuarioFinal: Usuario = {
        ...authenticatedUser,
        ...(perfilGuardado || {})
      };

      setUser(usuarioFinal);
      setIsAuthenticated(true);

      // Guardar únicamente la sesión actual
      localStorage.setItem(
        'currentUser',
        JSON.stringify(usuarioFinal)
      );

      return true;
    }

    return false;
  };

  // ============================================================
  // LOGOUT
  // ============================================================
  const logout = () => {

    setUser(null);
    setIsAuthenticated(false);

    // SOLO eliminamos la sesión.
    // NO eliminamos profile_correo@usuario.com
    localStorage.removeItem('currentUser');
  };

  // ============================================================
  // REGISTRO
  // ============================================================
  const register = async (
    userData: Partial<Usuario> & {
      confirmarPassword: string;
    }
  ): Promise<boolean> => {

    try {

      // Verificar contraseñas
      if (userData.password !== userData.confirmarPassword) {
        return false;
      }

      // Verificar email en mockUsuarios
      const existingUser = mockUsuarios.find(
        (u) => u.email === userData.email
      );

      if (existingUser) {
        return false;
      }

      // Obtener usuarios registrados
      const storedUsers = localStorage.getItem('registeredUsers');

      const registeredUsers: Usuario[] = storedUsers
        ? JSON.parse(storedUsers)
        : [];

      // Verificar email
      const existingRegisteredUser = registeredUsers.find(
        (u) => u.email === userData.email
      );

      if (existingRegisteredUser) {
        return false;
      }

      // Crear usuario
      const newUser: Usuario = {

        id: `${Date.now()}`,

        nombre: userData.nombre || '',

        apellidos: userData.apellidos || '',

        email: userData.email || '',

        password: userData.password || '',

        telefono: userData.telefono || '',

        rol: userData.rol || 'Usuario',

        iniciales: generarIniciales(
          userData.nombre || '',
          userData.apellidos || ''
        ),

        estado: 'Activo',

        fechaRegistro: new Date()
          .toISOString()
          .split('T')[0],

        fotoPerfil: userData.fotoPerfil,
      };

      // Guardar usuario registrado
      registeredUsers.push(newUser);

      localStorage.setItem(
        'registeredUsers',
        JSON.stringify(registeredUsers)
      );

      return true;

    } catch (error) {

      console.error('Error en registro:', error);

      return false;
    }
  };

  // ============================================================
  // ACTUALIZAR USUARIO
  // ============================================================
  const updateUser = (userData: Partial<Usuario>) => {

    if (!user) {
      return;
    }

    // Crear usuario actualizado
    const updatedUser: Usuario = {
      ...user,
      ...userData
    };

    // Actualizar estado React
    setUser(updatedUser);

    // Guardar sesión actual
    localStorage.setItem(
      'currentUser',
      JSON.stringify(updatedUser)
    );

    // ========================================================
    // GUARDAR PERFIL PERMANENTEMENTE
    // ========================================================

    guardarPerfil(updatedUser);

    // ========================================================
    // ACTUALIZAR TAMBIÉN registeredUsers
    // ========================================================

    const storedUsers = localStorage.getItem('registeredUsers');

    if (storedUsers) {

      const registeredUsers: Usuario[] =
        JSON.parse(storedUsers);

      const userIndex = registeredUsers.findIndex(
        (u) => u.id === user.id
      );

      if (userIndex !== -1) {

        registeredUsers[userIndex] = updatedUser;

        localStorage.setItem(
          'registeredUsers',
          JSON.stringify(registeredUsers)
        );
      }
    }
  };

  // ============================================================
  // CONTEXT
  // ============================================================

  const value: AuthContextType = {

    user,

    login,

    logout,

    register,

    updateUser,

    isAuthenticated,

  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// HOOK
// ============================================================

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuth debe ser usado dentro de un AuthProvider'
    );
  }

  return context;
};