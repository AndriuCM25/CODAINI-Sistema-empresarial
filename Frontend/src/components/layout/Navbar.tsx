import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, Settings, User, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../ui/Avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Notificacion } from '../../types';
import { tc } from '../../utils/themeClasses';

interface NavbarProps {
  onMenuClick: () => void;
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, title }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const unreadNotifications = notificaciones.filter((n) => !n.leida);

  return (
    <nav className={`${tc.navbar} px-4 py-3 sticky top-0 z-30`}>
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className={`lg:hidden ${tc.navIconBtn}`}
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className={`text-xl md:text-2xl font-bold ${tc.textHeading}`}>
            {title || 'Dashboard'}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">

          {/* ── Theme Toggle ──────────────────────────────────── */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`${tc.navIconBtn} relative`}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.span
                  key="sun"
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* ── Notifications ─────────────────────────────────── */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className={`relative ${tc.navIconBtn}`}
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-light-surface dark:ring-codaini-navy" />
              )}
            </button>

            {/* Notificaciones dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 mt-2 w-80 ${tc.dropdown} overflow-hidden z-20`}
                  >
                    <div className={`p-4 border-b ${tc.border}`}>
                      <h3 className={`font-semibold ${tc.textHeading}`}>
                        Notificaciones
                      </h3>
                      {unreadNotifications.length > 0 && (
                        <span className={`text-xs font-medium text-light-accent dark:text-codaini-cyan`}>
                          {unreadNotifications.length} sin leer
                        </span>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notificaciones.length === 0 ? (
                        <div className={`p-6 text-center ${tc.textMuted}`}>
                          No hay notificaciones
                        </div>
                      ) : (
                        notificaciones.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b ${tc.border} ${tc.hoverCard} transition-colors ${
                              !notif.leida
                                ? 'bg-light-accent/5 dark:bg-codaini-cyan/5 border-l-2 border-l-light-accent dark:border-l-codaini-cyan'
                                : ''
                            }`}
                          >
                            <p className={`font-medium text-sm ${tc.textPrimary}`}>
                              {notif.titulo}
                            </p>
                            <p className={`text-xs mt-1 ${tc.textMuted}`}>
                              {notif.mensaje}
                            </p>
                            <p className={`text-xs mt-1.5 ${tc.textMuted} opacity-70`}>
                              {notif.fecha}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* ── User Menu ─────────────────────────────────────── */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className={`flex items-center space-x-2 md:space-x-3 p-2 rounded-lg ${tc.hoverSurface} transition-colors`}
              aria-label="Menú de usuario"
            >
              <Avatar
                src={user?.fotoPerfil}
                iniciales={user?.iniciales}
                size="sm"
              />
              <div className="hidden md:block text-left">
                <p className={`text-sm font-semibold ${tc.textPrimary}`}>
                  {user?.nombre}
                </p>
                <p className={`text-xs ${tc.textMuted}`}>{user?.rol}</p>
              </div>
            </button>

            {/* User dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 mt-2 w-60 ${tc.dropdown} overflow-hidden z-20`}
                  >
                    {/* User info */}
                    <div className={`p-4 border-b ${tc.border}`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <Avatar
                          src={user?.fotoPerfil}
                          iniciales={user?.iniciales}
                          size="md"
                        />
                        <div>
                           <p className={`font-semibold text-sm ${tc.textPrimary}`}>
                             {user?.nombre} {user?.apellidos || ''}
                           </p>
                          <p className={`text-xs ${tc.textMuted} truncate max-w-[140px]`}>
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-light-accent/10 dark:bg-codaini-cyan/10 text-light-accent dark:text-codaini-cyan font-medium border border-light-accent/20 dark:border-codaini-cyan/20">
                        {user?.rol}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/perfil"
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center space-x-3 ${tc.dropdownItem}`}
                      >
                        <User className="w-4 h-4 text-light-muted dark:text-codaini-muted" />
                        <span>Ver perfil</span>
                      </Link>
                      <Link
                        to="/configuracion"
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center space-x-3 ${tc.dropdownItem}`}
                      >
                        <Settings className="w-4 h-4 text-light-muted dark:text-codaini-muted" />
                        <span>Configuración</span>
                      </Link>

                      <div className={`my-1 border-t ${tc.border}`} />

                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-2.5 w-full text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
