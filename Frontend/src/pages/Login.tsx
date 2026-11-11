import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Moon, Sun, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';
import Button from '../components/ui/Button';
import { getSwalConfig } from '../utils/swalTheme';
import { tc } from '../utils/themeClasses';

/* ── Partículas flotantes decorativas ──────────────────────────── */
const FloatingOrbs = ({ isDark }: { isDark: boolean }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-3xl opacity-20"
        style={{
          width:  `${120 + i * 40}px`,
          height: `${120 + i * 40}px`,
          left:   `${[10, 60, 30, 70, 15, 80][i]}%`,
          top:    `${[20, 10, 60, 50, 80, 30][i]}%`,
          background: isDark
            ? `hsl(${170 + i * 20}, 80%, ${40 + i * 5}%)`
            : `hsl(${190 + i * 15}, 70%, ${55 + i * 5}%)`,
        }}
        animate={{
          x: [0, 20, -10, 15, 0],
          y: [0, -15, 20, -8, 0],
          scale: [1, 1.1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: i * 1.2,
        }}
      />
    ))}
  </div>
);

/* ── Grid decorativo de puntos ─────────────────────────────────── */
const DotGrid = ({ isDark }: { isDark: boolean }) => (
  <div
    className="absolute inset-0 opacity-[0.06] pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, ${isDark ? '#64FFDA' : '#0F766E'} 1px, transparent 1px)`,
      backgroundSize: '28px 28px',
    }}
  />
);

/* ── Chip de feature ───────────────────────────────────────────── */
const FeatureChip = ({ icon, label, isDark }: { icon: string; label: string; isDark: boolean }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -2 }}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border ${
      isDark
        ? 'bg-codaini-navy/60 border-codaini-border/40 text-codaini-cyan'
        : 'bg-white/60 border-light-border/60 text-light-accent'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════ */
const Login: React.FC = () => {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const { login }               = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate                = useNavigate();

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
          text: 'Correo o contraseña incorrectos.',
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Correo o contraseña incorrectos.';
      await Swal.fire({
        ...getSwalConfig(isDark),
        icon: 'error',
        title: 'Error de autenticación',
        text: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const accentColor = isDark ? '#64FFDA' : '#0F766E';

  return (
    <div className="min-h-screen flex transition-colors duration-500 overflow-hidden bg-light-bg dark:bg-codaini-navy">

      {/* ── Botón de tema ── */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={`fixed top-5 right-5 z-50 p-2.5 rounded-xl ${tc.navIconBtn} backdrop-blur-sm shadow-lg border ${
          isDark ? 'border-codaini-border/40' : 'border-light-border/60'
        }`}
        aria-label="Cambiar tema"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span key="sun" initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.3 }}>
              <Sun className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span key="moon" initial={{ opacity: 0, rotate: 90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: -90, scale: 0.5 }} transition={{ duration: 0.3 }}>
              <Moon className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ════════════════════════════════════════════
          COLUMNA IZQUIERDA — FORMULARIO
      ════════════════════════════════════════════ */}
      <div className="relative w-full lg:w-[45%] xl:w-[40%] flex items-center justify-center p-8 z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px]"
        >
          {/* ── Logo + Título ── */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 14 }}
              className="inline-flex items-center justify-center w-20 h-20 mb-5 rounded-2xl relative"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(100,255,218,0.15), rgba(100,255,218,0.05))'
                  : 'linear-gradient(135deg, rgba(15,118,110,0.15), rgba(15,118,110,0.05))',
                boxShadow: isDark
                  ? '0 0 40px rgba(100,255,218,0.2), inset 0 1px 0 rgba(100,255,218,0.15)'
                  : '0 0 40px rgba(15,118,110,0.15), inset 0 1px 0 rgba(15,118,110,0.2)',
                border: `1px solid ${isDark ? 'rgba(100,255,218,0.2)' : 'rgba(15,118,110,0.2)'}`,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={isDark ? 'logo-dark' : 'logo-light'}
                  src={isDark ? '/logo_codaini_dark.png' : '/logo_codaini_light.png'}
                  alt="Logo CODAINI"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="w-12 h-12"
                />
              </AnimatePresence>
              {/* Anillo pulsante */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ border: `1px solid ${isDark ? 'rgba(100,255,218,0.4)' : 'rgba(15,118,110,0.4)'}` }}
                animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <h1 className="text-4xl font-black tracking-tight text-light-accent dark:text-codaini-cyan">
                CODAINI
              </h1>
              <p className={`text-xs font-medium mt-1 uppercase tracking-[0.15em] ${tc.textMuted}`}>
                Sistema Empresarial
              </p>
            </motion.div>
          </div>

          {/* ── Card del formulario ── */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: isDark
                ? 'linear-gradient(145deg, rgba(17,34,64,0.95), rgba(10,25,47,0.98))'
                : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,1))',
              border: `1px solid ${isDark ? 'rgba(100,255,218,0.12)' : 'rgba(15,118,110,0.12)'}`,
              boxShadow: isDark
                ? '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(100,255,218,0.08)'
                : '0 25px 60px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            {/* Barra de acento superior */}
            <div
              className="h-0.5 w-full"
              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
            />

            <div className="p-8">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <h2 className={`text-xl font-bold ${tc.textHeading} mb-1`}>Bienvenido de vuelta</h2>
                <p className={`text-sm ${tc.textMuted} mb-7`}>Ingresa tus credenciales para continuar</p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}>
                  <label htmlFor="login-email" className={`${tc.inputLabel} mb-2 flex items-center gap-1.5`}>
                    <Mail className="w-3.5 h-3.5" /> Correo electrónico
                  </label>
                  <div className="relative">
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`${tc.input} transition-all duration-200`}
                      placeholder="admin@codaini.com"
                      autoComplete="email"
                      style={{
                        boxShadow: focusedField === 'email'
                          ? `0 0 0 3px ${isDark ? 'rgba(100,255,218,0.15)' : 'rgba(15,118,110,0.12)'}`
                          : 'none',
                      }}
                    />
                    <AnimatePresence>
                      {focusedField === 'email' && (
                        <motion.div
                          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
                          className="absolute bottom-0 left-0 right-0 h-0.5 origin-left rounded-full"
                          style={{ background: accentColor }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.62 }}>
                  <label htmlFor="login-password" className={`${tc.inputLabel} mb-2 flex items-center gap-1.5`}>
                    <Lock className="w-3.5 h-3.5" /> Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`${tc.input} pr-10 transition-all duration-200`}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      style={{
                        boxShadow: focusedField === 'password'
                          ? `0 0 0 3px ${isDark ? 'rgba(100,255,218,0.15)' : 'rgba(15,118,110,0.12)'}`
                          : 'none',
                      }}
                    />
                    <AnimatePresence>
                      {focusedField === 'password' && (
                        <motion.div
                          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
                          className="absolute bottom-0 left-0 right-0 h-0.5 origin-left rounded-full"
                          style={{ background: accentColor }}
                        />
                      )}
                    </AnimatePresence>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute inset-y-0 right-0 pr-3 flex items-center ${tc.textMuted} hover:text-light-text dark:hover:text-codaini-text transition-colors`}
                    >
                      <AnimatePresence mode="wait">
                        {showPassword ? (
                          <motion.span key="off" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.15 }}>
                            <EyeOff className="w-4 h-4" />
                          </motion.span>
                        ) : (
                          <motion.span key="on" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}>
                            <Eye className="w-4 h-4" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                  className="pt-2"
                >
                  <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2">
                          <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                            <Loader2 className="w-4 h-4" />
                          </motion.span>
                          Iniciando sesión...
                        </motion.span>
                      ) : (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          Iniciar sesión
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Feature chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
            className="flex flex-wrap gap-2 justify-center mt-6"
          >
            <FeatureChip icon="🔒" label="Acceso seguro JWT" isDark={isDark} />
            <FeatureChip icon="⚡" label="Tiempo real"       isDark={isDark} />
            <FeatureChip icon="📊" label="Dashboard inteligente" isDark={isDark} />
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className={`text-center text-xs mt-5 ${tc.textMuted}`}
          >
            © {new Date().getFullYear()} CODAINI · Todos los derechos reservados
          </motion.p>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════
          COLUMNA DERECHA — IMAGEN
      ════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block lg:w-[55%] xl:w-[60%] relative overflow-hidden"
      >
        {/* Orbs y grid de fondo */}
        <FloatingOrbs isDark={isDark} />
        <DotGrid isDark={isDark} />

        {/* Imagen principal con transición suave al cambiar tema */}
        <AnimatePresence mode="wait">
          <motion.img
            key={isDark ? 'dark-bg' : 'light-bg'}
            src={isDark ? '/login-dark.jpg' : '/login-light.jpg'}
            alt="CODAINI ilustración"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Overlay de transición hacia el formulario */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'linear-gradient(to right, rgba(10,25,47,0.9) 0%, rgba(10,25,47,0.2) 35%, transparent 100%)'
              : 'linear-gradient(to right, rgba(240,249,250,0.9) 0%, rgba(240,249,250,0.2) 35%, transparent 100%)',
          }}
        />

        {/* Badge inferior con glassmorphism */}
        <div className="absolute bottom-8 left-8 right-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="backdrop-blur-xl rounded-2xl p-5"
            style={{
              background: isDark ? 'rgba(10,25,47,0.75)' : 'rgba(255,255,255,0.80)',
              border: `1px solid ${isDark ? 'rgba(100,255,218,0.15)' : 'rgba(15,118,110,0.15)'}`,
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: accentColor }}
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <p className={`text-sm font-bold ${isDark ? 'text-codaini-cyan' : 'text-light-accent'}`}>
                CODAINI · Sistema Empresarial
              </p>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-codaini-muted' : 'text-light-muted'}`}>
              Gestión integral de proyectos, clientes y equipo en un solo lugar.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
