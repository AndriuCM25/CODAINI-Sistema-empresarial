import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Proyectos from './pages/Proyectos';
import Tareas from './pages/Tareas';
import Usuarios from './pages/Usuarios';
import Trabajadores from './pages/Trabajadores';
import Asistencias from './pages/Asistencias';
import Capacitaciones from './pages/Capacitaciones';
import Recordatorios from './pages/Recordatorios';
import Reportes from './pages/Reportes';
import Perfil from './pages/Perfil';
import Configuracion from './pages/Configuracion';
import SobreCodaini from './pages/SobreCodaini';
import Mensajeria from './pages/Mensajeria';

const AppLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({
  children,
  title,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-light-bg dark:bg-codaini-navy transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={title} />

        <main className="flex-1 overflow-y-auto p-6 bg-light-bg dark:bg-codaini-navy">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* /register — solo Administrador */}
            <Route
              path="/register"
              element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <AppLayout title="Crear Usuario">
                    <Register />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout title="Dashboard">
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/clientes"
              element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <AppLayout title="Clientes">
                    <Clientes />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/proyectos"
              element={
                <ProtectedRoute>
                  <AppLayout title="Proyectos">
                    <Proyectos />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/tareas"
              element={
                <ProtectedRoute>
                  <AppLayout title="Tareas">
                    <Tareas />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/usuarios"
              element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <AppLayout title="Usuarios">
                    <Usuarios />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/trabajadores"
              element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <AppLayout title="Trabajadores">
                    <Trabajadores />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/asistencias"
              element={
                <ProtectedRoute allowedRoles={['Administrador', 'Trabajador']}>
                  <AppLayout title="Asistencias">
                    <Asistencias />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/capacitaciones"
              element={
                <ProtectedRoute allowedRoles={['Administrador', 'Trabajador']}>
                  <AppLayout title="Capacitaciones">
                    <Capacitaciones />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/recordatorios"
              element={
                <ProtectedRoute>
                  <AppLayout title="Recordatorios">
                    <Recordatorios />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reportes"
              element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <AppLayout title="Reportes">
                    <Reportes />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <AppLayout title="Mi Perfil">
                    <Perfil />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/configuracion"
              element={
                <ProtectedRoute>
                  <AppLayout title="Configuración">
                    <Configuracion />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/sobre-codaini"
              element={
                <ProtectedRoute>
                  <AppLayout title="Sobre CODAINI">
                    <SobreCodaini />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/mensajeria"
              element={
                <ProtectedRoute>
                  <AppLayout title="Mensajería">
                    <Mensajeria />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
