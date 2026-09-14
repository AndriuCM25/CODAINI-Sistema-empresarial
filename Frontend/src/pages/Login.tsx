import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Moon,
  Sun,
} from 'lucide-react';

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
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-light-bg
        dark:bg-codaini-navy
        transition-colors
        duration-300
      "
    >

      {/* CONTENEDOR PRINCIPAL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="
          relative
          w-full
          min-h-screen
          lg:min-h-[700px]
          lg:h-screen
          lg:max-h-[900px]
          lg:grid
          lg:grid-cols-2
          overflow-hidden
          bg-light-bg
          dark:bg-codaini-navy
        "
      >

        {/* =========================================
            BOTÓN CAMBIAR TEMA
        ========================================= */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className={`
            fixed
            top-5
            right-5
            z-50
            p-3
            rounded-xl
            backdrop-blur-md
            ${tc.navIconBtn}
          `}
          aria-label="Cambiar tema"
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.span
                key="sun"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>


        {/* =========================================
            COLUMNA IZQUIERDA - LOGIN
        ========================================= */}
        <div
          className="
            flex
            items-center
            justify-center
            px-6
            py-12
            sm:px-10
            lg:px-12
            xl:px-20
            bg-light-bg
            dark:bg-codaini-navy
          "
        >

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="
              w-full
              max-w-[530px]
            "
          >

{/* LOGO + NOMBRE */}
<div className="mb-8">

  <div className="flex items-center gap-4">

    <motion.img
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      src={
        isDark
          ? '/logo_codaini(darkMODE).png'
          : '/logo_codaini.png'
      }
      alt="Logo CODAINI"
      className="
        w-16
        h-16
        sm:w-20
        sm:h-20
        object-contain
      "
    />

    <motion.h1
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="
        text-3xl
        sm:text-4xl
        font-bold
        tracking-wide
        text-light-text
        dark:text-codaini-text
      "
    >
      CODAINI
    </motion.h1>

  </div>

  {/* BIENVENIDA */}
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="mt-8"
  >

    <h2
      className="
        text-4xl
        sm:text-5xl
        font-bold
        tracking-tight
        text-light-text
        dark:text-codaini-text
      "
    >
      Bienvenido de{' '}
      <span
        className="
          text-light-accent
          dark:text-codaini-cyan
        "
      >
        nuevo
      </span>
    </h2>

    <p
      className={`
        mt-3
        text-base
        ${tc.textMuted}
      `}
    >
      Inicia sesión para continuar con tu trabajo.
    </p>

  </motion.div>

</div>


            {/* =========================================
                FORMULARIO
            ========================================= */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* CORREO */}
                <div>

                  <label
                    className={`
                      ${tc.inputLabel}
                      flex
                      items-center
                      gap-2
                      mb-2
                    `}
                  >
                    <Mail className="w-4 h-4" />
                    Correo electrónico
                  </label>

                  <div className="relative">

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`
                        ${tc.input}
                        w-full
                        h-12
                        pl-4
                        pr-4
                        rounded-xl
                      `}
                      placeholder="tu@correo.com"
                    />

                  </div>

                </div>


                {/* CONTRASEÑA */}
                <div>

                  <label
                    className={`
                      ${tc.inputLabel}
                      flex
                      items-center
                      gap-2
                      mb-2
                    `}
                  >
                    <Lock className="w-4 h-4" />
                    Contraseña
                  </label>

                  <div className="relative">

                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={`
                        ${tc.input}
                        w-full
                        h-12
                        pl-4
                        pr-12
                        rounded-xl
                      `}
                      placeholder="Ingresa tu contraseña"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="
                        absolute
                        inset-y-0
                        right-0
                        px-4
                        flex
                        items-center
                        text-gray-400
                        hover:text-light-accent
                        dark:hover:text-codaini-cyan
                        transition-colors
                      "
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>

                  </div>

                </div>


                {/* RECORDAR + OLVIDASTE */}
                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-3
                  "
                >

                  <label
                    htmlFor="remember"
                    className="
                      flex
                      items-center
                      gap-2
                      cursor-pointer
                    "
                  >

                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) =>
                        setRememberMe(e.target.checked)
                      }
                      className="
                        w-4
                        h-4
                        rounded
                        text-light-accent
                        dark:text-codaini-cyan
                      "
                    />

                    <span
                      className={`
                        text-sm
                        ${tc.textMuted}
                      `}
                    >
                      Recordarme por 30 días
                    </span>

                  </label>


                  <button
                    type="button"
                    className="
                      text-sm
                      font-medium
                      text-light-accent
                      dark:text-codaini-cyan
                      hover:underline
                      text-left
                      sm:text-right
                    "
                  >
                    ¿Olvidaste tu contraseña?
                  </button>

                </div>


                {/* BOTÓN */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="
                    w-full
                    h-14
                    rounded-xl
                    text-base
                    font-semibold
                  "
                >
                  {isLoading
                    ? 'Iniciando sesión...'
                    : 'Iniciar sesión'}
                </Button>
                <motion.button
  type="button"
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.99 }}
  className="
    w-full
    h-14
    mt-3
    rounded-xl
    border
    border-light-border
    dark:border-codaini-border
    bg-white
    dark:bg-transparent
    text-light-text
    dark:text-codaini-text
    font-medium
    flex
    items-center
    justify-center
    gap-3
    hover:bg-gray-50
    dark:hover:bg-white/5
    transition-all
  "
  onClick={() => {
    console.log('Iniciar sesión con Google');
  }}
>
  {/* Google Icon */}
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fill="#4285F4"
      d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
    />
    <path
      fill="#34A853"
      d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.6z"
    />
    <path
      fill="#FBBC05"
      d="M6.54 13.69A5.86 5.86 0 0 1 6.23 12c0-.59.11-1.16.31-1.69V7.78H3.3A9.73 9.73 0 0 0 2.27 12c0 1.57.38 3.05 1.03 4.22l3.24-2.53z"
    />
    <path
      fill="#EA4335"
      d="M12 6.28c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.35 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8 9.46 6.28 12 6.28z"
    />
  </svg>

  <span>
    Iniciar sesión con Google
  </span>

</motion.button>

              </form>


              {/* =========================================
                  CREDENCIALES
              ========================================= */}
              <div
                className="
                  mt-6
                  p-4
                  rounded-xl
                  border
                  border-light-accent/20
                  dark:border-codaini-cyan/20
                  bg-light-accent/5
                  dark:bg-codaini-cyan/5
                "
              >

                <p
                  className={`
                    text-xs
                    ${tc.textMuted}
                    mb-3
                    font-semibold
                    uppercase
                    tracking-wide
                  `}
                >
                  Credenciales de prueba
                </p>

                <div
                  className={`
                    space-y-1.5
                    text-xs
                    ${tc.textMuted}
                  `}
                >

                  <p>
                    <strong className={tc.textPrimary}>
                      Administrador:
                    </strong>{' '}
                    admin@codaini.com / 123456
                  </p>

                  <p>
                    <strong className={tc.textPrimary}>
                      Trabajador:
                    </strong>{' '}
                    carlos@codaini.com / 123456
                  </p>

                  <p>
                    <strong className={tc.textPrimary}>
                      Cliente:
                    </strong>{' '}
                    ana@empresa.com / 123456
                  </p>

                </div>

              </div>


              {/* REGISTRO */}
              <p
                className={`
                  mt-6
                  text-sm
                  text-center
                  ${tc.textMuted}
                `}
              >
                ¿No tienes una cuenta?{' '}

                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="
                    font-semibold
                    text-light-accent
                    dark:text-codaini-cyan
                    hover:underline
                  "
                >
                  Regístrate
                </button>

              </p>

            </motion.div>

          </motion.div>

        </div>


        {/* =========================================
            COLUMNA DERECHA - IMAGEN
        ========================================= */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
          className="
            hidden
            lg:block
            relative
            overflow-hidden
          "
        >

          <AnimatePresence mode="wait">

            <motion.img
              key={isDark ? 'dark' : 'light'}
              initial={{
                opacity: 0,
                scale: 1.03,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.03,
              }}
              transition={{
                duration: 0.4,
              }}
              src={
                isDark
                  ? '/login-dark.png'
                  : '/login-light.png'
              }
              alt="CODAINI"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
              "
            />

          </AnimatePresence>

        </motion.div>

      </motion.div>

    </div>
  );
};

export default Login;