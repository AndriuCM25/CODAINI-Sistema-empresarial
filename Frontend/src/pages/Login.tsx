import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';
import Button from '../components/ui/Button';
import { getSwalConfig } from '../utils/swalTheme';
import { tc } from '../utils/themeClasses';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        await Swal.fire({
          ...getSwalConfig(isDark),
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Inicio de sesión exitoso',
          timer: 1500,
          showConfirmButton: false,
        });
        navigate('/dashboard');
      } else {
        await Swal.fire({
          ...getSwalConfig(isDark),
          icon: 'error',
          title: 'Error de autenticación',
          text: 'Correo o contraseña incorrectos',
        });
      }
    } catch {
      await Swal.fire({
        ...getSwalConfig(isDark),
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al iniciar sesión',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg via-light-surface-2 to-light-bg dark:from-codaini-navy dark:via-codaini-navy-light dark:to-codaini-navy flex items-center justify-center p-4 transition-colors duration-300">

      {/* Botón de tema discreto */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-2.5 rounded-xl ${tc.navIconBtn} backdrop-blur-sm`}
        aria-label="Cambiar tema"
        title={isDark ? 'Modo claro' : 'Modo oscuro'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span key="sun" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
              <Sun className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span key="moon" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
              <Moon className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo y nombre */}
        <div className="text-center mb-8">
          <motion.img
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            src={isDark ? '/logo_codaini(darkMODE).png' : '/logo_codaini.png'}
            alt="Logo CODAINI"
            className="w-24 h-24 mx-auto mb-4 drop-shadow-lg transition-opacity duration-300"
          />
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-light-accent dark:text-codaini-cyan mb-1"
          >
            CODAINI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={tc.textMuted}
          >
            Sistema de Gestión Empresarial
          </motion.p>
        </div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${tc.card} p-8`}
        >
          <h2 className={`text-2xl font-bold ${tc.textHeading} mb-6`}>
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className={tc.inputLabel}>
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`w-4 h-4 ${tc.textMuted}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`${tc.input} pl-9`}
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={tc.inputLabel}>
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`w-4 h-4 ${tc.textMuted}`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${tc.input} pl-9 pr-10`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${tc.textMuted} hover:text-light-text dark:hover:text-codaini-text transition-colors`}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-light-border dark:border-codaini-border text-light-accent dark:text-codaini-cyan focus:ring-light-accent dark:focus:ring-codaini-cyan"
              />
              <label htmlFor="remember" className={`ml-2 text-sm ${tc.textMuted}`}>
                Recordarme
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          {/* Credenciales de prueba */}
          <div className={`mt-5 p-4 rounded-lg bg-light-accent/5 dark:bg-codaini-cyan/5 border border-light-accent/15 dark:border-codaini-cyan/15`}>
            <p className={`text-xs ${tc.textMuted} mb-2 font-semibold uppercase tracking-wide`}>
              Credenciales de prueba
            </p>
            <div className={`space-y-1 text-xs ${tc.textMuted}`}>
              <p><strong className={tc.textPrimary}>Administrador:</strong> admin@codaini.com / 123456</p>
              <p><strong className={tc.textPrimary}>Trabajador:</strong> carlos@codaini.com / 123456</p>
              <p><strong className={tc.textPrimary}>Cliente:</strong> ana@empresa.com / 123456</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
