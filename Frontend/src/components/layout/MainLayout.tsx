import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getTitleFromPath = (path: string): string => {
    const titles: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/clientes': 'Clientes',
      '/proyectos': 'Proyectos',
      '/tareas': 'Tareas',
      '/usuarios': 'Usuarios',
      '/trabajadores': 'Trabajadores',
      '/asistencias': 'Asistencias',
      '/capacitaciones': 'Capacitaciones',
      '/recordatorios': 'Recordatorios',
      '/reportes': 'Reportes',
      '/perfil': 'Mi Perfil',
      '/configuracion': 'Configuración',
    };
    return titles[path] || 'CODAINI';
  };

  return (
    <div className="flex h-screen bg-light-bg dark:bg-codaini-navy overflow-hidden transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar
          title={getTitleFromPath(location.pathname)}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-light-bg dark:bg-codaini-navy transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
