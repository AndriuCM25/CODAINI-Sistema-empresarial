import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, User, Bell, Database,
  ChevronRight, ChevronDown, Download, Trash2,
  ToggleLeft, ToggleRight, Save,
} from 'lucide-react';
import { tc } from '../utils/themeClasses';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';
import { getSwalConfig } from '../utils/swalTheme';

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface NotifPrefs {
  nuevosProyectos: boolean;
  tareasAsignadas: boolean;
  asistencias: boolean;
  alertasSistema: boolean;
}

const DEFAULT_NOTIF: NotifPrefs = {
  nuevosProyectos: true,
  tareasAsignadas: true,
  asistencias: false,
  alertasSistema: true,
};

function loadNotifPrefs(): NotifPrefs {
  try {
    const raw = localStorage.getItem('notif_prefs');
    return raw ? { ...DEFAULT_NOTIF, ...JSON.parse(raw) } : DEFAULT_NOTIF;
  } catch {
    return DEFAULT_NOTIF;
  }
}

function getLocalStorageSize(): string {
  let total = 0;
  for (const key in localStorage) {
    if (!Object.prototype.hasOwnProperty.call(localStorage, key)) continue;
    total += (localStorage[key].length + key.length) * 2;
  }
  if (total < 1024) return `${total} bytes`;
  if (total < 1024 * 1024) return `${(total / 1024).toFixed(1)} KB`;
  return `${(total / (1024 * 1024)).toFixed(2)} MB`;
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
const Toggle: React.FC<{ value: boolean; onChange: () => void; label: string; desc?: string }> = ({
  value, onChange, label, desc,
}) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className={`text-sm font-medium ${tc.textPrimary}`}>{label}</p>
      {desc && <p className={`text-xs mt-0.5 ${tc.textMuted}`}>{desc}</p>}
    </div>
    <button
      onClick={onChange}
      className="flex-shrink-0 ml-4 transition-colors"
      aria-label={`Toggle ${label}`}
    >
      {value
        ? <ToggleRight className="w-8 h-8 text-light-accent dark:text-codaini-cyan" />
        : <ToggleLeft className="w-8 h-8 text-light-muted dark:text-codaini-muted" />}
    </button>
  </div>
);

// ── Componente principal ──────────────────────────────────────────────────────
const Configuracion: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const isAdmin = user?.rol === 'Administrador';

  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>(loadNotifPrefs);

  const togglePanel = (name: string) => {
    setOpenPanel((prev) => (prev === name ? null : name));
  };

  const toggleNotif = (key: keyof NotifPrefs) => {
    setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveNotifPrefs = () => {
    localStorage.setItem('notif_prefs', JSON.stringify(notifPrefs));
    Swal.fire({
      ...getSwalConfig(isDark),
      icon: 'success',
      title: 'Preferencias guardadas',
      text: 'Tus notificaciones han sido actualizadas.',
      timer: 2000,
      showConfirmButton: false,
    });
    setOpenPanel(null);
  };

  const exportarPerfil = () => {
    const dataStr = JSON.stringify(user, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perfil_${user?.nombre?.toLowerCase().replace(/\s+/g, '_') || 'usuario'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    Swal.fire({
      ...getSwalConfig(isDark),
      icon: 'success',
      title: 'Exportado',
      text: 'Tu perfil fue descargado como JSON.',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const limpiarCache = async () => {
    const result = await Swal.fire({
      ...getSwalConfig(isDark),
      icon: 'warning',
      title: '¿Limpiar caché?',
      text: 'Se eliminarán las preferencias locales (notificaciones, tema guardado, etc). Tu sesión se mantendrá.',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    const keepKeys = ['token', 'currentUser'];
    const toDelete: string[] = [];
    for (const key in localStorage) {
      if (!Object.prototype.hasOwnProperty.call(localStorage, key)) continue;
      if (!keepKeys.includes(key)) toDelete.push(key);
    }
    toDelete.forEach((k) => localStorage.removeItem(k));

    Swal.fire({
      ...getSwalConfig(isDark),
      icon: 'success',
      title: 'Caché limpiada',
      text: 'Las preferencias locales fueron eliminadas.',
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const panelVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.25 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Configuración</h1>
        <p className={`mt-1 ${tc.textMuted}`}>Ajustes del sistema y preferencias</p>
      </motion.div>

      {/* Tarjeta destacada — Sobre CODAINI */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Link to="/sobre-codaini">
          <div className={`${tc.cardShadow} p-6 hover:shadow-lg dark:hover:shadow-codaini-lg transition-all duration-300 group cursor-pointer border-light-accent/30 dark:border-codaini-cyan/30`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-light-accent/10 dark:bg-codaini-cyan/10 rounded-xl group-hover:bg-light-accent/20 dark:group-hover:bg-codaini-cyan/20 transition-colors">
                  <Building2 className="w-6 h-6 text-light-accent dark:text-codaini-cyan" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${tc.textPrimary}`}>Sobre CODAINI</h3>
                  <p className={`text-sm mt-0.5 ${tc.textMuted}`}>
                    Información institucional, misión, visión, servicios y ubicación
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-light-accent dark:text-codaini-cyan opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Grid de configuraciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ── Perfil Personal ───────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Link to="/perfil" className="block h-full">
            <div className={`${tc.card} p-5 hover:shadow-md dark:hover:shadow-codaini transition-all duration-300 cursor-pointer group h-full`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-light-accent/10 dark:bg-codaini-cyan/10 rounded-xl group-hover:bg-light-accent/20 dark:group-hover:bg-codaini-cyan/20 transition-colors flex-shrink-0">
                    <User className="w-5 h-5 text-light-accent dark:text-codaini-cyan" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${tc.textPrimary}`}>Perfil Personal</h3>
                    <p className={`text-sm mt-0.5 ${tc.textMuted}`}>Editar nombre, foto y datos de contacto</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-light-muted dark:text-codaini-muted opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ── Notificaciones (solo Admin) ───────── */}
        {isAdmin && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div
              onClick={() => togglePanel('notif')}
              className={`${tc.card} p-5 hover:shadow-md dark:hover:shadow-codaini transition-all duration-300 cursor-pointer group`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-light-accent/10 dark:bg-codaini-cyan/10 rounded-xl group-hover:bg-light-accent/20 dark:group-hover:bg-codaini-cyan/20 transition-colors flex-shrink-0">
                    <Bell className="w-5 h-5 text-light-accent dark:text-codaini-cyan" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${tc.textPrimary}`}>Notificaciones</h3>
                    <p className={`text-sm mt-0.5 ${tc.textMuted}`}>Preferencias y frecuencia de alertas</p>
                  </div>
                </div>
                {openPanel === 'notif'
                  ? <ChevronDown className="w-4 h-4 text-light-accent dark:text-codaini-cyan flex-shrink-0 transition-transform" />
                  : <ChevronRight className="w-4 h-4 text-light-muted dark:text-codaini-muted opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                }
              </div>
            </div>

            {/* Panel de notificaciones */}
            <AnimatePresence>
              {openPanel === 'notif' && (
                <motion.div
                  key="notif-panel"
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="overflow-hidden"
                >
                  <div className={`${tc.surface2} rounded-b-xl border ${tc.border} border-t-0 px-5 pb-4`}>
                    <div className={`divide-y ${tc.divider}`}>
                      <Toggle value={notifPrefs.nuevosProyectos} onChange={() => toggleNotif('nuevosProyectos')}
                        label="Nuevos proyectos" desc="Recibir alerta cuando se cree un proyecto" />
                      <Toggle value={notifPrefs.tareasAsignadas} onChange={() => toggleNotif('tareasAsignadas')}
                        label="Tareas asignadas" desc="Notificar cuando se te asigne una tarea" />
                      <Toggle value={notifPrefs.asistencias} onChange={() => toggleNotif('asistencias')}
                        label="Resumen de asistencias" desc="Reporte diario de asistencias del equipo" />
                      <Toggle value={notifPrefs.alertasSistema} onChange={() => toggleNotif('alertasSistema')}
                        label="Alertas del sistema" desc="Mantenimientos y actualizaciones" />
                    </div>
                    <button
                      onClick={saveNotifPrefs}
                      className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-light-accent dark:bg-codaini-cyan text-white dark:text-codaini-navy text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Save className="w-4 h-4" /> Guardar preferencias
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Datos y Exportación ───────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div
            onClick={() => togglePanel('datos')}
            className={`${tc.card} p-5 hover:shadow-md dark:hover:shadow-codaini transition-all duration-300 cursor-pointer group`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-light-accent/10 dark:bg-codaini-cyan/10 rounded-xl group-hover:bg-light-accent/20 dark:group-hover:bg-codaini-cyan/20 transition-colors flex-shrink-0">
                  <Database className="w-5 h-5 text-light-accent dark:text-codaini-cyan" />
                </div>
                <div>
                  <h3 className={`font-semibold ${tc.textPrimary}`}>Datos y Exportación</h3>
                  <p className={`text-sm mt-0.5 ${tc.textMuted}`}>Gestión de datos y copias de seguridad</p>
                </div>
              </div>
              {openPanel === 'datos'
                ? <ChevronDown className="w-4 h-4 text-light-accent dark:text-codaini-cyan flex-shrink-0" />
                : <ChevronRight className="w-4 h-4 text-light-muted dark:text-codaini-muted opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              }
            </div>
          </div>

          {/* Panel de datos */}
          <AnimatePresence>
            {openPanel === 'datos' && (
              <motion.div
                key="datos-panel"
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden"
              >
                <div className={`${tc.surface2} rounded-b-xl border ${tc.border} border-t-0 px-5 py-4 space-y-3`}>
                  {/* Info de caché */}
                  <div className={`text-xs ${tc.textMuted} bg-light-surface dark:bg-codaini-navy-light rounded-lg px-3 py-2 border ${tc.border}`}>
                    📦 Caché local ocupado: <span className="font-semibold text-light-accent dark:text-codaini-cyan">{getLocalStorageSize()}</span>
                  </div>

                  {/* Exportar perfil */}
                  <button
                    onClick={exportarPerfil}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-light-accent/10 dark:bg-codaini-cyan/10 hover:bg-light-accent/20 dark:hover:bg-codaini-cyan/20 transition-colors group"
                  >
                    <Download className="w-5 h-5 text-light-accent dark:text-codaini-cyan flex-shrink-0" />
                    <div className="text-left">
                      <p className={`text-sm font-medium ${tc.textPrimary}`}>Exportar perfil (JSON)</p>
                      <p className={`text-xs ${tc.textMuted}`}>Descarga tus datos personales en formato JSON</p>
                    </div>
                  </button>

                  {/* Limpiar caché */}
                  <button
                    onClick={limpiarCache}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">Limpiar caché local</p>
                      <p className={`text-xs ${tc.textMuted}`}>Elimina preferencias guardadas localmente</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Configuracion;
