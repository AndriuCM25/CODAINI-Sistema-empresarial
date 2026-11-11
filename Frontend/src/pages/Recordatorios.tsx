import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, CheckCircle, Circle, Trash2 } from 'lucide-react';
import { mockRecordatorios } from '../data/mockData';
import { Recordatorio, Prioridad } from '../types';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { tc } from '../utils/themeClasses';
import { useTheme } from '../context/ThemeContext';
import { getSwalConfig, getSwalDeleteConfig } from '../utils/swalTheme';
import Swal from 'sweetalert2';

const STORAGE_KEY = 'codaini_recordatorios';

const Recordatorios: React.FC = () => {
  const { isDark } = useTheme();
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'pendientes' | 'completados'>('todos');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecordatorios(JSON.parse(saved));
      } catch {
        setRecordatorios(mockRecordatorios);
      }
    } else {
      setRecordatorios(mockRecordatorios);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRecordatorios));
    }
  }, []);

  const saveRecordatorios = (newList: Recordatorio[]) => {
    setRecordatorios(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  const handleToggle = (id: string) => {
    const updated = recordatorios.map((r) =>
      r.id === id ? { ...r, completado: !r.completado } : r
    );
    saveRecordatorios(updated);
  };

  const handleDelete = (rec: Recordatorio) => {
    Swal.fire({
      ...getSwalDeleteConfig(isDark),
      title: '¿Eliminar recordatorio?',
      text: `Se borrará "${rec.titulo}" permanentemente.`,
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = recordatorios.filter((r) => r.id !== rec.id);
        saveRecordatorios(updated);
        Swal.fire({
          ...getSwalConfig(isDark),
          icon: 'success',
          title: 'Eliminado',
          text: 'El recordatorio fue eliminado.',
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleCrear = () => {
    Swal.fire({
      ...getSwalConfig(isDark),
      title: 'Nuevo Recordatorio',
      html: `
        <input id="swal-rec-titulo" class="swal2-input" placeholder="Título del recordatorio" />
        <textarea id="swal-rec-desc" class="swal2-textarea" placeholder="Descripción"></textarea>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:10px;">
          <input id="swal-rec-fecha" type="date" class="swal2-input" style="width:48%;margin:0;" value="${new Date().toISOString().split('T')[0]}" />
          <input id="swal-rec-hora" type="time" class="swal2-input" style="width:48%;margin:0;" value="09:00" />
        </div>
        <select id="swal-rec-prio" class="swal2-select" style="width:100%;margin-top:10px;">
          <option value="Alta">Prioridad Alta</option>
          <option value="Media" selected>Prioridad Media</option>
          <option value="Baja">Prioridad Baja</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: 'Crear Recordatorio',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const titulo = (document.getElementById('swal-rec-titulo') as HTMLInputElement)?.value.trim();
        const desc = (document.getElementById('swal-rec-desc') as HTMLTextAreaElement)?.value.trim();
        const fecha = (document.getElementById('swal-rec-fecha') as HTMLInputElement)?.value;
        const hora = (document.getElementById('swal-rec-hora') as HTMLInputElement)?.value;
        const prioridad = (document.getElementById('swal-rec-prio') as HTMLSelectElement)?.value as Prioridad;

        if (!titulo) {
          Swal.showValidationMessage('El título es obligatorio');
          return false;
        }
        return { titulo, desc, fecha, hora, prioridad };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { titulo, desc, fecha, hora, prioridad } = result.value;
        const nuevo: Recordatorio = {
          id: String(Date.now()),
          titulo,
          descripcion: desc,
          fecha: fecha || new Date().toISOString().split('T')[0],
          hora: hora || '09:00',
          prioridad,
          completado: false,
          usuarioId: '1',
        };
        const updated = [nuevo, ...recordatorios];
        saveRecordatorios(updated);

        Swal.fire({
          ...getSwalConfig(isDark),
          icon: 'success',
          title: '¡Creado!',
          text: 'Recordatorio añadido a tu agenda personal.',
          timer: 1800,
          showConfirmButton: false,
        });
      }
    });
  };

  const listaFiltrada = recordatorios.filter((r) => {
    if (filtro === 'pendientes') return !r.completado;
    if (filtro === 'completados') return r.completado;
    return true;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${tc.textHeading}`}>Recordatorios</h1>
          <p className={`mt-1 ${tc.textMuted}`}>Gestión de agenda y recordatorios corporativos</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleCrear}>
          Nuevo Recordatorio
        </Button>
      </motion.div>

      {/* Filtros */}
      <div className="flex gap-2 border-b border-light-border dark:border-codaini-border pb-3">
        {(['todos', 'pendientes', 'completados'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFiltro(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              filtro === tab
                ? 'bg-light-accent dark:bg-codaini-cyan text-white dark:text-codaini-navy font-semibold shadow-sm'
                : `${tc.textMuted} hover:bg-light-surface-2 dark:hover:bg-codaini-navy-light`
            }`}
          >
            {tab} ({
              tab === 'todos'
                ? recordatorios.length
                : tab === 'pendientes'
                ? recordatorios.filter((r) => !r.completado).length
                : recordatorios.filter((r) => r.completado).length
            })
          </button>
        ))}
      </div>

      {listaFiltrada.length === 0 ? (
        <div className={`text-center py-16 ${tc.cardShadow} p-8`}>
          <p className={`text-base ${tc.textMuted}`}>No hay recordatorios en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {listaFiltrada.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                ${tc.card} p-6
                border-l-4 transition-all duration-300
                ${
                  rec.completado
                    ? 'border-l-green-500 opacity-60'
                    : rec.prioridad === 'Alta'
                    ? 'border-l-red-500'
                    : rec.prioridad === 'Media'
                    ? 'border-l-yellow-500'
                    : 'border-l-blue-500'
                }
                hover:shadow-md dark:hover:shadow-codaini
              `}
            >
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggle(rec.id)}
                    className="text-light-accent dark:text-codaini-cyan hover:scale-110 transition-transform flex-shrink-0"
                    title={rec.completado ? 'Marcar pendiente' : 'Marcar completado'}
                  >
                    {rec.completado ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <h3 className={`font-bold ${tc.textPrimary} truncate ${rec.completado ? 'line-through opacity-70' : ''}`}>
                    {rec.titulo}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={rec.prioridad === 'Alta' ? 'danger' : rec.prioridad === 'Media' ? 'warning' : 'info'} dot>
                    {rec.prioridad}
                  </Badge>
                  <button
                    onClick={() => handleDelete(rec)}
                    className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Eliminar recordatorio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className={`text-sm ${tc.textMuted} mb-4 ${rec.completado ? 'line-through opacity-60' : ''}`}>
                {rec.descripcion}
              </p>

              <div className={`flex items-center gap-4 text-sm ${tc.textMuted}`}>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-light-accent dark:text-codaini-cyan" />
                  <span>{new Date(rec.fecha).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-light-accent dark:text-codaini-cyan" />
                  <span>{rec.hora}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recordatorios;
