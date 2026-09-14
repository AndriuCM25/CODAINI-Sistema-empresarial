import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, Briefcase, Building, Moon, Sun, HardHat, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';
import Button from '../components/ui/Button';
import { getSwalConfig } from '../utils/swalTheme';
import { tc } from '../utils/themeClasses';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmarPassword: '',
    telefono: '',
    cargo: '',
    area: '',
    empresa: '',
    rol: '' as 'Trabajador' | 'Usuario' | '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRolChange = (rol: 'Trabajador' | 'Usuario') => {
    setFormData({ ...formData, rol, cargo: '', area: '', empresa: '' });
  };

  const validateForm = (): boolean => {
    const swalCfg = getSwalConfig(isDark);

    if (!formData.rol) {
      Swal.fire({ ...swalCfg, icon: 'warning', title: 'Selecciona un tipo de cuenta', text: 'Debes seleccionar si eres Trabajador o Usuario/Cliente' });
      return false;
    }
    if (!formData.nombre || !formData.apellidos || !formData.email || !formData.password || !formData.confirmarPassword || !formData.telefono) {
      Swal.fire({ ...swalCfg, icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa todos los campos obligatorios' });
      return false;
    }
    if (formData.rol === 'Trabajador' && (!formData.cargo || !formData.area)) {
      Swal.fire({ ...swalCfg, icon: 'warning', title: 'Campos incompletos', text: 'Los trabajadores deben completar Cargo y Área' });
      return false;
    }
    if (formData.rol === 'Usuario' && !formData.empresa) {
      Swal.fire({ ...swalCfg, icon: 'warning', title: 'Campos incompletos', text: 'Los usuarios/clientes deben completar el nombre de su empresa' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({ ...swalCfg, icon: 'error', title: 'Correo inválido', text: 'Por favor ingresa un correo electrónico válido' });
      return false;
    }
    if (formData.password.length < 6) {
      Swal.fire({ ...swalCfg, icon: 'error', title: 'Contraseña muy corta', text: 'La contraseña debe tener al menos 6 caracteres' });
      return false;
    }
    if (formData.password !== formData.confirmarPassword) {
      Swal.fire({ ...swalCfg, icon: 'error', title: 'Las contraseñas no coinciden', text: 'Por favor verifica que ambas contraseñas sean iguales' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const success = await register(formData as any);
      if (success) {
        await Swal.fire({ ...getSwalConfig(isDark), icon: 'success', title: '¡Registro exitoso!', text: 'Tu cuenta ha sido creada correctamente' });
        navigate('/login');
      } else {
        await Swal.fire({ ...getSwalConfig(isDark), icon: 'error', title: 'Error en el registro', text: 'El correo electrónico ya está registrado' });
      }
    } catch {
      await Swal.fire({ ...getSwalConfig(isDark), icon: 'error', title: 'Error', text: 'Ocurrió un error al crear la cuenta' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = tc.input;
  const inputWithIcon = `${tc.input} pl-9`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg via-light-surface-2 to-light-bg dark:from-codaini-navy dark:via-codaini-navy-light dark:to-codaini-navy flex items-center justify-center p-4 transition-colors duration-300">

      {/* Theme toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-2.5 rounded-xl ${tc.navIconBtn}`}
        aria-label="Cambiar tema"
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <motion.img initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
            src={isDark ? '/logo_codaini(darkMODE).png' : '/logo_codaini.png'}
            alt="Logo CODAINI" className="w-20 h-20 mx-auto mb-3 drop-shadow-lg transition-opacity duration-300" />
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-light-accent dark:text-codaini-cyan mb-1">
            CODAINI
          </motion.h1>
          <p className={`text-sm ${tc.textMuted}`}>Sistema de Gestión Empresarial</p>
        </div>

        {/* Formulario */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className={`${tc.card} p-8`}>
          <h2 className={`text-2xl font-bold ${tc.textHeading} mb-6`}>Crear una cuenta</h2>

          {/* Selección de tipo */}
          <div className="mb-6">
            <label className={tc.inputLabel}>¿Quieres registrarte como?</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {(['Trabajador', 'Usuario'] as const).map((rol) => (
                <button key={rol} type="button" onClick={() => handleRolChange(rol)}
                  className={`p-4 border-2 rounded-xl text-sm font-semibold transition-all duration-200 flex flex-col items-center gap-2 ${ 
                    formData.rol === rol
                      ? 'border-light-accent dark:border-codaini-cyan bg-light-accent/10 dark:bg-codaini-cyan/10 text-light-accent dark:text-codaini-cyan'
                      : `${tc.border} ${tc.textMuted} hover:border-light-accent dark:hover:border-codaini-cyan ${tc.hoverSurface}`
                  }`}>
                  <span className="text-2xl">
                    {rol === 'Trabajador'
                      ? <HardHat className="w-6 h-6" />
                      : <Building2 className="w-6 h-6" />
                    }
                  </span>
                  {rol === 'Trabajador' ? 'Trabajador' : 'Usuario / Cliente'}
                </button>
              ))}
            </div>
          </div>

          {formData.rol && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre y Apellidos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={tc.inputLabel}>Nombre *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className={`w-4 h-4 ${tc.textMuted}`} /></div>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className={inputWithIcon} placeholder="Juan" />
                  </div>
                </div>
                <div>
                  <label className={tc.inputLabel}>Apellidos *</label>
                  <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required className={inputCls} placeholder="Pérez García" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={tc.inputLabel}>Correo electrónico *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className={`w-4 h-4 ${tc.textMuted}`} /></div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputWithIcon} placeholder="correo@ejemplo.com" />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className={tc.inputLabel}>Teléfono *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className={`w-4 h-4 ${tc.textMuted}`} /></div>
                  <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required className={inputWithIcon} placeholder="+51 987 654 321" />
                </div>
              </div>

              {/* Campos por rol */}
              {formData.rol === 'Trabajador' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={tc.inputLabel}>Cargo *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Briefcase className={`w-4 h-4 ${tc.textMuted}`} /></div>
                      <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} required className={inputWithIcon} placeholder="Desarrollador" />
                    </div>
                  </div>
                  <div>
                    <label className={tc.inputLabel}>Área *</label>
                    <input type="text" name="area" value={formData.area} onChange={handleChange} required className={inputCls} placeholder="Desarrollo" />
                  </div>
                </div>
              )}
              {formData.rol === 'Usuario' && (
                <div>
                  <label className={tc.inputLabel}>Empresa *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Building className={`w-4 h-4 ${tc.textMuted}`} /></div>
                    <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} required className={inputWithIcon} placeholder="Mi Empresa S.A.C." />
                  </div>
                </div>
              )}

              {/* Contraseñas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={tc.inputLabel}>Contraseña *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className={`w-4 h-4 ${tc.textMuted}`} /></div>
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required className={`${inputWithIcon} pr-10`} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute inset-y-0 right-0 pr-3 flex items-center ${tc.textMuted}`}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={tc.inputLabel}>Confirmar contraseña *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className={`w-4 h-4 ${tc.textMuted}`} /></div>
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmarPassword" value={formData.confirmarPassword} onChange={handleChange} required className={`${inputWithIcon} pr-10`} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute inset-y-0 right-0 pr-3 flex items-center ${tc.textMuted}`}>
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Foto de perfil */}
              <div>
                <label className={tc.inputLabel}>
                  Foto de perfil <span className={`${tc.textMuted} ml-1 font-normal`}>(Opcional)</span>
                </label>
                <input type="file" accept="image/*"
                  className={`block w-full text-sm ${tc.textMuted} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-light-accent/10 dark:file:bg-codaini-cyan/10 file:text-light-accent dark:file:text-codaini-cyan hover:file:opacity-80 cursor-pointer`}
                />
              </div>

              <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full mt-2">
                {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className={`text-sm ${tc.textMuted}`}>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-light-accent dark:text-codaini-cyan font-semibold hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
