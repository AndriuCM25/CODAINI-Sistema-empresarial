import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

// Auth Pages
import Login from '../pages/Login';
import Register from '../pages/Register';

// Main Pages - se crearán a continuación
import Dashboard from '../pages/Dashboard';
import Clientes from '../pages/Clientes';
import Proyectos from '../pages/Proyectos';
import Tareas from '../pages/Tareas';
import Usuarios from '../pages/Usuarios';
import Trabajadores from '../pages/Trabajadores';
import Asistencias from '../pages/Asistencias';
import Capacitaciones from '../pages/Capacitaciones';
import Recordatorios from '../pages/Recordatorios';
import Reportes from '../pages/Reportes';
import Perfil from '../pages/Perfil';
import Configuracion from '../pages/Configuracion';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard - Todos los roles */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Clientes - Solo Administrador */}
        <Route
          path="clientes"
          element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <Clientes />
            </ProtectedRoute>
          }
        />

        {/* Proyectos - Todos los roles */}
        <Route path="proyectos" element={<Proyectos />} />

        {/* Tareas - Administrador y Trabajador */}
        <Route
          path="tareas"
          element={
            <ProtectedRoute allowedRoles={['Administrador', 'Trabajador']}>
              <Tareas />
            </ProtectedRoute>
          }
        />

        {/* Usuarios - Solo Administrador */}
        <Route
          path="usuarios"
          element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <Usuarios />
            </ProtectedRoute>
          }
        />

        {/* Trabajadores - Solo Administrador */}
        <Route
          path="trabajadores"
          element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <Trabajadores />
            </ProtectedRoute>
          }
        />

        {/* Asistencias - Administrador y Trabajador */}
        <Route
          path="asistencias"
          element={
            <ProtectedRoute allowedRoles={['Administrador', 'Trabajador']}>
              <Asistencias />
            </ProtectedRoute>
          }
        />

        {/* Capacitaciones - Administrador y Trabajador */}
        <Route
          path="capacitaciones"
          element={
            <ProtectedRoute allowedRoles={['Administrador', 'Trabajador']}>
              <Capacitaciones />
            </ProtectedRoute>
          }
        />

        {/* Recordatorios - Todos los roles */}
        <Route path="recordatorios" element={<Recordatorios />} />

        {/* Reportes - Solo Administrador */}
        <Route
          path="reportes"
          element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <Reportes />
            </ProtectedRoute>
          }
        />

        {/* Perfil - Todos los roles */}
        <Route path="perfil" element={<Perfil />} />

        {/* Configuración - Solo Administrador */}
        <Route
          path="configuracion"
          element={
            <ProtectedRoute allowedRoles={['Administrador']}>
              <Configuracion />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
