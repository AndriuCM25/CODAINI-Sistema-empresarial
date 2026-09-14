import React from 'react';

import { Link, useLocation, Location } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';

import { useTheme } from '../../context/ThemeContext';

import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  UserCog,
  Clock,
  BookOpen,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

import Avatar from '../ui/Avatar';

import { tc } from '../../utils/themeClasses';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

// ── Contenido interno reutilizable ─────────────────────────────────────────

interface ContentProps {
  isDark: boolean;
  user: ReturnType<typeof useAuth>['user'];
  location: Location;
  onClose: () => void;
  filteredMenuItems: MenuItem[];
  handleLogout: () => void;
}

const SidebarContent: React.FC<ContentProps> = ({
  isDark,
  user,
  location,
  onClose,
  filteredMenuItems,
  handleLogout,
}) => (
  <>
    {/* ── HEADER ───────────────────────────────────────────────────── */}

    <div className={`p-5 border-b ${tc.border} shrink-0`}>
      <div className="flex items-center justify-between">

        {/* LOGO + NOMBRE */}
        <div className="flex items-center space-x-3">

          <img
            src={
              isDark
                ? '/logo_codaini(darkMODE).png'
                : '/logo_codaini.png'
            }
            alt="Logo CODAINI"
            className="
              w-10
              h-10
              object-contain
              transition-opacity
              duration-300
            "
          />

          <div>
            <h1 className="text-xl font-bold text-light-accent dark:text-codaini-cyan">
              CODAINI
            </h1>

            <p className={`text-xs ${tc.textMuted}`}>
              Sistema de Gestión
            </p>
          </div>

        </div>

        {/* BOTÓN CERRAR EN MÓVIL */}
        <button
          onClick={onClose}
          className={`lg:hidden ${tc.navIconBtn} p-2`}
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>

      </div>
    </div>


    {/* ── USUARIO LOGUEADO ─────────────────────────────────────────── */}

    <div className={`px-4 py-5 border-b ${tc.border}`}>

      <Link
        to="/perfil"
        onClick={onClose}
        className={`
          flex
          flex-col
          items-center
          justify-center
          gap-3
          p-4
          rounded-xl
          ${tc.hoverSurface}
          transition-all
          duration-200
          text-center
        `}
      >

        {/* FOTO DEL USUARIO */}

        <div className="relative">

          <Avatar
            src={user?.fotoPerfil}
            iniciales={user?.iniciales}
            size="xl"
            className='w-32 h-32 ring-4 ring-light-accent/20 dark:ring-codaini-cyan/20'
          />

          {/* INDICADOR DE USUARIO CONECTADO */}

          <span
            className="
              absolute
              bottom-1
              right-1
              w-4
              h-4
              rounded-full
              bg-green-500
              border-2
              border-white
              dark:border-codaini-navy
            "
          />

        </div>


        {/* NOMBRE */}

        <div className="min-w-0 w-full">

          <p
            className={`
              text-base
              font-semibold
              ${tc.textPrimary}
              truncate
            `}
          >
            {user?.nombre} {user?.apellidos}
          </p>


          {/* ROL */}

          <p
            className="
              text-sm
              text-light-accent
              dark:text-codaini-cyan
              truncate
              mt-1
              font-medium
            "
          >
            {user?.rol}
          </p>

        </div>

      </Link>

    </div>


    {/* ── NAVEGACIÓN ───────────────────────────────────────────────── */}

    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">

      {filteredMenuItems.map((item) => {

        const isActive = location.pathname === item.path;

        return (

          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`
              flex
              items-center
              space-x-3
              px-4
              py-2.5
              rounded-lg
              transition-all
              duration-200
              group

              ${
                isActive
                  ? `${tc.sidebarActive} shadow-sm`
                  : `${tc.sidebarItem}`
              }
            `}
          >

            {/* ICONO */}

            <span
              className={`
                flex-shrink-0

                ${
                  isActive
                    ? ''
                    : 'opacity-70 group-hover:opacity-100'
                }
              `}
            >
              {item.icon}
            </span>


            {/* TEXTO */}

            <span className="text-sm font-medium">
              {item.label}
            </span>


            {/* INDICADOR ACTIVO */}

            {isActive && (
              <span
                className="
                  ml-auto
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-current
                  opacity-80
                "
              />
            )}

          </Link>

        );

      })}

    </nav>


    {/* ── CERRAR SESIÓN ────────────────────────────────────────────── */}

    <div
      className={`
        p-4
        border-t
        ${tc.border}
        space-y-1
        shrink-0
      `}
    >

      <button
        onClick={handleLogout}
        className="
          flex
          items-center
          space-x-3
          px-4
          py-2.5
          w-full
          rounded-lg
          text-sm
          text-red-500
          dark:text-red-400
          hover:bg-red-50
          dark:hover:bg-red-900/10
          transition-colors
        "
      >

        <LogOut className="w-4 h-4 flex-shrink-0" />

        <span>
          Cerrar sesión
        </span>

      </button>

    </div>

  </>
);


// ── SIDEBAR PRINCIPAL ───────────────────────────────────────────────────────

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
}) => {

  const { user, logout } = useAuth();

  const { isDark } = useTheme();

  const location = useLocation();


  // ── MENÚ ───────────────────────────────────────────────────────────

  const menuItems: MenuItem[] = [

    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['Administrador', 'Trabajador', 'Usuario'],
    },

    {
      path: '/clientes',
      label: 'Clientes',
      icon: <Users className="w-5 h-5" />,
      roles: ['Administrador'],
    },

    {
      path: '/proyectos',
      label: 'Proyectos',
      icon: <Briefcase className="w-5 h-5" />,
      roles: ['Administrador', 'Trabajador', 'Usuario'],
    },

    {
      path: '/tareas',
      label: 'Tareas',
      icon: <CheckSquare className="w-5 h-5" />,
      roles: ['Administrador', 'Trabajador', 'Usuario'],
    },

    {
      path: '/usuarios',
      label: 'Usuarios',
      icon: <UserCog className="w-5 h-5" />,
      roles: ['Administrador'],
    },

    {
      path: '/trabajadores',
      label: 'Trabajadores',
      icon: <Users className="w-5 h-5" />,
      roles: ['Administrador'],
    },

    {
      path: '/asistencias',
      label: 'Asistencias',
      icon: <Clock className="w-5 h-5" />,
      roles: ['Administrador', 'Trabajador'],
    },

    {
      path: '/capacitaciones',
      label: 'Capacitaciones',
      icon: <BookOpen className="w-5 h-5" />,
      roles: ['Administrador', 'Trabajador'],
    },

    {
      path: '/recordatorios',
      label: 'Recordatorios',
      icon: <Bell className="w-5 h-5" />,
      roles: ['Administrador', 'Trabajador', 'Usuario'],
    },

    {
      path: '/reportes',
      label: 'Reportes',
      icon: <BarChart3 className="w-5 h-5" />,
      roles: ['Administrador'],
    },

    {
      path: '/configuracion',
      label: 'Configuración',
      icon: <Settings className="w-5 h-5" />,
      roles: ['Administrador', 'Trabajador', 'Usuario'],
    },

  ];


  // ── FILTRAR MENÚ SEGÚN ROL ────────────────────────────────────────

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.rol || '')
  );


  // ── LOGOUT ────────────────────────────────────────────────────────

  const handleLogout = () => {

    logout();

    onClose();

  };


  // ── PROPS DEL CONTENIDO ───────────────────────────────────────────

  const contentProps: ContentProps = {
    isDark,
    user,
    location,
    onClose,
    filteredMenuItems,
    handleLogout,
  };


  return (
    <>

      {/* ============================================================
          DESKTOP
          ============================================================ */}

      <aside
        className={`
          hidden
          lg:flex
          lg:flex-col
          lg:w-72
          lg:min-h-screen
          lg:h-screen
          lg:sticky
          lg:top-0
          lg:shrink-0

          ${tc.sidebarBg}
          border-r
          ${tc.border}
        `}
      >

        <SidebarContent {...contentProps} />

      </aside>


      {/* ============================================================
          MOBILE
          ============================================================ */}

      <AnimatePresence>

        {isOpen && (

          <>

            {/* ── OVERLAY ─────────────────────────────────────────── */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="
                fixed
                inset-0
                bg-black/60
                backdrop-blur-sm
                z-40
                lg:hidden
              "
              onClick={onClose}
            />


            {/* ── PANEL ──────────────────────────────────────────── */}

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                damping: 28,
                stiffness: 220,
              }}
              className={`
                fixed
                top-0
                left-0
                h-screen
                w-72
                z-50
                flex
                flex-col

                ${tc.sidebarBg}
                border-r
                ${tc.border}
                shadow-2xl
                dark:shadow-codaini
              `}
            >

              <SidebarContent {...contentProps} />

            </motion.aside>

          </>

        )}

      </AnimatePresence>

    </>
  );
};


export default Sidebar;