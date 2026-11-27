import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, LayoutGrid, List, BarChart2, Filter, Search,
  GitBranch, ExternalLink, ChevronDown, Layers, X,
  Bug, Star, CheckCircle2, Zap, Flag, Tag, Hash,
  RefreshCw, Eye
} from 'lucide-react';
import {
  Tarea, FaseTarea, Prioridad, TipoTarea, EstadoTarea,
  Proyecto, Trabajador, Sprint
} from '../types';
import { tareasService, proyectosService, trabajadoresService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { tc } from '../utils/themeClasses';
import { getSwalConfig } from '../utils/swalTheme';
import Swal from 'sweetalert2';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import Modal from '../components/ui/Modal';
import { FASES } from '../components/scrum/KanbanBoard';
import KanbanBoard from '../components/scrum/KanbanBoard';
import ListView from '../components/scrum/ListView';
import TaskDetailModal from '../components/scrum/TaskDetailModal';
import SprintHeader from '../components/scrum/SprintHeader';

// ── Tipos de vista ───────────────────────────────────────────────────────
type Vista = 'kanban' | 'lista' | 'metricas';

// ── Sprints demo (hasta que el backend los soporte) ──────────────────────
const SPRINTS_DEMO: Sprint[] = [
  {
    id: 'sp-1', nombre: 'Sprint 1', objetivo: 'Establecer base del sistema',
    proyectoId: '', proyecto: 'General', estado: 'Completado',
    fechaInicio: '2026-10-01', fechaFin: '2026-10-14',
  },
  {
    id: 'sp-2', nombre: 'Sprint 2', objetivo: 'Módulos core y autenticación',
    proyectoId: '', proyecto: 'General', estado: 'Completado',
    fechaInicio: '2026-10-15', fechaFin: '2026-10-28',
  },
  {
    id: 'sp-3', nombre: 'Sprint 3', objetivo: 'Dashboard, proyectos y tareas',
    proyectoId: '', proyecto: 'General', estado: 'Activo',
    fechaInicio: '2026-11-01', fechaFin: '2026-11-30',
  },
  {
    id: 'sp-4', nombre: 'Sprint 4', objetivo: 'Reportes y mejoras UX',
    proyectoId: '', proyecto: 'General', estado: 'Planificado',
    fechaInicio: '2026-12-01', fechaFin: '2026-12-15',
  },
];

const TIPOS: TipoTarea[] = ['Historia', 'Bug', 'Tarea', 'Épica', 'Subtarea'];
const PRIORIDADES: Prioridad[] = ['Alta', 'Media', 'Baja'];

const tipoIcon: Record<TipoTarea, React.ReactNode> = {
  Historia: <Star className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
  Bug:      <Bug className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />,
  Tarea:    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />,
  Épica:    <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
  Subtarea: <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />,
};

// ── Form de tarea ────────────────────────────────────────────────────────
interface TareaFormData {
  titulo: string;
  descripcion: string;
  proyectoId: string;
  proyecto: string;
  responsableId: string;
  responsable: string;
  prioridad: Prioridad;
  fechaLimite: string;
  fase: FaseTarea;
  tipo: TipoTarea;
  sprintId: string;
  sprint: string;
  repositorio: string;
  feature: string;
  storyPoints: string;
  etiquetas: string;
}

const defaultForm: TareaFormData = {
  titulo: '', descripcion: '', proyectoId: '', proyecto: '',
  responsableId: '', responsable: '', prioridad: 'Media',
  fechaLimite: '', fase: 'Por hacer', tipo: 'Tarea',
  sprintId: 'sp-3', sprint: 'Sprint 3',
  repositorio: '', feature: '', storyPoints: '', etiquetas: '',
};

// ── Helpers de colores ───────────────────────────────────────────────────
const sprintEstadoColor: Record<Sprint['estado'], string> = {
  Planificado: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700/40',
  Activo:      'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700/40',
  Completado:  'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600/40',
};

// ── Componente principal ──────────────────────────────────────────────────
const Tareas: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'Administrador';

  // ── State ────────────────────────────────────────────────────────────
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [proyectosList, setProyectosList] = useState<Proyecto[]>([]);
  const [trabajadoresList, setTrabajadoresList] = useState<Trabajador[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [vista, setVista] = useState<Vista>('kanban');
  const [sprintActivo, setSprintActivo] = useState<Sprint>(SPRINTS_DEMO[2]);
  const [sprintSelectorOpen, setSprintSelectorOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filtroProyecto, setFiltroProyecto] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroMisPanel, setFiltroMisTareas] = useState(false);
  const [filtrosOpen, setFiltrosOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<TareaFormData>(defaultForm);
  const [editando, setEditando] = useState<Tarea | null>(null);
  const [tareaDetalle, setTareaDetalle] = useState<Tarea | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);

  // ── Carga inicial ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tareasRes, proyRes, trabRes] = await Promise.allSettled([
          tareasService.getAll(),
          proyectosService.getAll(),
          trabajadoresService.getAll(),
        ]);
        if (tareasRes.status === 'fulfilled') setTareas(tareasRes.value);
        if (proyRes.status === 'fulfilled') setProyectosList(proyRes.value);
        if (trabRes.status === 'fulfilled') setTrabajadoresList(trabRes.value);
      } catch { /* silent */ } finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  // ── Filtrado ─────────────────────────────────────────────────────────
  const tareasFiltradas = useMemo(() => {
    return tareas.filter((t) => {
      const matchSearch = !searchTerm ||
        t.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.feature?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchProyecto = !filtroProyecto || t.proyectoId === filtroProyecto;
      const matchPrioridad = !filtroPrioridad || t.prioridad === filtroPrioridad;
      const matchTipo = !filtroTipo || t.tipo === filtroTipo;
      const matchMias = !filtroMisPanel || t.responsableId === user?.id;
      return matchSearch && matchProyecto && matchPrioridad && matchTipo && matchMias;
    });
  }, [tareas, searchTerm, filtroProyecto, filtroPrioridad, filtroTipo, filtroMisPanel, user]);

  // ── Handlers del formulario ──────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'proyectoId') {
      const sel = proyectosList.find(p => p.id === value);
      setForm(prev => ({ ...prev, proyectoId: value, proyecto: sel?.nombre ?? '' }));
    } else if (name === 'responsableId') {
      const sel = trabajadoresList.find(t => t.id === value);
      setForm(prev => ({ ...prev, responsableId: value, responsable: sel ? `${sel.nombre} ${sel.apellidos ?? ''}`.trim() : '' }));
    } else if (name === 'sprintId') {
      const sp = SPRINTS_DEMO.find(s => s.id === value);
      setForm(prev => ({ ...prev, sprintId: value, sprint: sp?.nombre ?? '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const abrirModalNueva = () => {
    setEditando(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const abrirModalEditar = (t: Tarea) => {
    setEditando(t);
    setForm({
      titulo: t.titulo, descripcion: t.descripcion,
      proyectoId: t.proyectoId ?? '', proyecto: t.proyecto ?? '',
      responsableId: t.responsableId ?? '', responsable: t.responsable ?? '',
      prioridad: t.prioridad, fechaLimite: t.fechaLimite,
      fase: t.fase ?? 'Por hacer', tipo: t.tipo ?? 'Tarea',
      sprintId: t.sprintId ?? 'sp-3', sprint: t.sprint ?? 'Sprint 3',
      repositorio: t.repositorio ?? '', feature: t.feature ?? '',
      storyPoints: t.storyPoints !== undefined ? String(t.storyPoints) : '',
      etiquetas: (t.etiquetas ?? []).join(', '),
    });
    setDetalleOpen(false);
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    if (!form.titulo.trim()) {
      Swal.fire({ ...getSwalConfig(isDark), icon: 'warning', title: 'Título requerido', text: 'Escribe un título para la tarea.' });
      return;
    }
    if (!form.repositorio.trim()) {
      Swal.fire({ ...getSwalConfig(isDark), icon: 'warning', title: 'Repositorio requerido', text: 'El desarrollador debe indicar el repositorio donde trabaja.' });
      return;
    }
    if (!form.feature.trim()) {
      Swal.fire({ ...getSwalConfig(isDark), icon: 'warning', title: 'Feature requerida', text: 'Indica la rama o feature en la que estás trabajando.' });
      return;
    }

    const sp = SPRINTS_DEMO.find(s => s.id === form.sprintId);
    const payload: Partial<Tarea> = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      proyectoId: form.proyectoId || undefined,
      proyecto: form.proyecto || proyectosList[0]?.nombre || 'General',
      responsableId: form.responsableId || undefined,
      responsable: form.responsable || trabajadoresList[0]?.nombre || 'Sin asignar',
      prioridad: form.prioridad,
      estado: (form.fase === 'Hecho' ? 'Completada' : form.fase === 'En progreso' ? 'En progreso' : 'Pendiente') as EstadoTarea,
      fechaLimite: form.fechaLimite || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      fase: form.fase,
      tipo: form.tipo,
      sprintId: form.sprintId,
      sprint: sp?.nombre ?? form.sprint,
      repositorio: form.repositorio.trim(),
      feature: form.feature.trim(),
      storyPoints: form.storyPoints ? parseInt(form.storyPoints) : undefined,
      etiquetas: form.etiquetas ? form.etiquetas.split(',').map(t => t.trim()).filter(Boolean) : [],
    };

    try {
      if (editando) {
        const actualizada = await tareasService.update(editando.id, payload);
        const merged = { ...editando, ...payload, ...actualizada } as Tarea;
        setTareas(prev => prev.map(t => t.id === editando.id ? merged : t));
        Swal.fire({ ...getSwalConfig(isDark), icon: 'success', title: '¡Actualizada!', text: 'Tarea actualizada correctamente.', timer: 2000, showConfirmButton: false });
      } else {
        const nueva = await tareasService.create(payload);
        const conFase = { ...nueva, ...payload } as Tarea;
        setTareas(prev => [conFase, ...prev]);
        Swal.fire({ ...getSwalConfig(isDark), icon: 'success', title: '¡Creada!', text: 'Tarea agregada al backlog.', timer: 2000, showConfirmButton: false });
      }
      setModalOpen(false);
      setForm(defaultForm);
      setEditando(null);
    } catch {
      Swal.fire({ ...getSwalConfig(isDark), icon: 'error', title: 'Error', text: 'No se pudo guardar la tarea.' });
    }
  };

  const handleEliminar = async (id: string) => {
    const result = await Swal.fire({
      ...getSwalConfig(isDark),
      icon: 'warning', title: '¿Eliminar tarea?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true, confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar', confirmButtonColor: '#EF4444',
    });
    if (!result.isConfirmed) return;
    try {
      await tareasService.delete(id);
      setTareas(prev => prev.filter(t => t.id !== id));
      setDetalleOpen(false);
      Swal.fire({ ...getSwalConfig(isDark), icon: 'success', title: 'Eliminada', timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ ...getSwalConfig(isDark), icon: 'error', title: 'Error', text: 'No se pudo eliminar.' });
    }
  };

  // Mover tarea de fase (Kanban drag simulation via selector)
  const handleMoverFase = (id: string, fase: FaseTarea) => {
    const estadoMap: Record<FaseTarea, EstadoTarea> = {
      Backlog: 'Pendiente', 'Por hacer': 'Pendiente',
      'En progreso': 'En progreso', 'En revisión': 'En progreso',
      Hecho: 'Completada',
    };
    setTareas(prev => prev.map(t =>
      t.id === id ? { ...t, fase, estado: estadoMap[fase] } : t
    ));
    // Persistir en backend
    tareasService.update(id, { fase, estado: estadoMap[fase] }).catch(() => {});
  };

  const handleCardClick = (t: Tarea) => {
    setTareaDetalle(t);
    setDetalleOpen(true);
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setFiltroProyecto('');
    setFiltroPrioridad('');
    setFiltroTipo('');
    setFiltroMisTareas(false);
  };

  const hayFiltros = searchTerm || filtroProyecto || filtroPrioridad || filtroTipo || filtroMisPanel;

  // ── Métricas ─────────────────────────────────────────────────────────
  const metricasPorFase = FASES.map(f => ({
    ...f,
    count: tareasFiltradas.filter(t => (t.fase || 'Por hacer') === f.id).length,
  }));

  if (isLoading) return <Loading />;

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* ── Barra superior ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${tc.cardShadow} px-5 py-4`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          {/* Izquierda: título + selector de sprint */}
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <h1 className={`text-xl font-bold ${tc.textHeading}`}>Tablero SCRUM</h1>
              <p className={`text-xs ${tc.textMuted}`}>Metodología ágil · estilo Jira</p>
            </div>

            {/* Sprint selector */}
            <div className="relative">
              <button
                onClick={() => setSprintSelectorOpen(!sprintSelectorOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${tc.border} ${tc.surface2} hover:border-purple-500/50 transition-all text-sm`}
              >
                <Layers className="w-4 h-4 text-purple-400" />
                <span className={`font-semibold ${tc.textPrimary}`}>{sprintActivo.nombre}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${sprintEstadoColor[sprintActivo.estado]}`}>
                  {sprintActivo.estado}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 ${tc.textMuted} transition-transform ${sprintSelectorOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {sprintSelectorOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    className={`absolute left-0 top-full mt-2 w-72 z-30 ${tc.dropdown} p-2`}
                  >
                    <p className={`text-[10px] font-semibold uppercase tracking-wider ${tc.textMuted} px-2 pb-2`}>Sprints</p>
                    {SPRINTS_DEMO.map(sp => (
                      <button
                        key={sp.id}
                        onClick={() => { setSprintActivo(sp); setSprintSelectorOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 ${sp.id === sprintActivo.id ? 'bg-purple-900/40 border border-purple-700/40' : tc.hoverSurface}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${tc.textPrimary}`}>{sp.nombre}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${sprintEstadoColor[sp.estado]}`}>{sp.estado}</span>
                        </div>
                        <p className={`text-[11px] ${tc.textMuted} mt-0.5`}>{sp.objetivo}</p>
                        <p className={`text-[10px] ${tc.textMuted} mt-0.5`}>{sp.fechaInicio} → {sp.fechaFin}</p>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Derecha: vistas + nuevo */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Toggle vistas */}
            <div className={`flex items-center gap-1 p-1 rounded-xl border ${tc.border} ${tc.surface2}`}>
              {([
                { id: 'kanban' as Vista, icon: <LayoutGrid className="w-4 h-4" />, label: 'Kanban' },
                { id: 'lista' as Vista, icon: <List className="w-4 h-4" />, label: 'Lista' },
                { id: 'metricas' as Vista, icon: <BarChart2 className="w-4 h-4" />, label: 'Métricas' },
              ] as const).map(v => (
                <button
                  key={v.id}
                  onClick={() => setVista(v.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    vista === v.id
                      ? 'bg-light-accent dark:bg-codaini-cyan text-white dark:text-codaini-navy shadow-sm'
                      : `${tc.textMuted} ${tc.hoverSurface}`
                  }`}
                >
                  {v.icon}
                  <span className="hidden sm:block">{v.label}</span>
                </button>
              ))}
            </div>

            {(isAdmin || true) && (
              <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={abrirModalNueva}>
                Nueva tarea
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Sprint Header (métricas activas) ── */}
      <SprintHeader
        sprintNombre={sprintActivo.nombre}
        sprintObjetivo={sprintActivo.objetivo}
        fechaInicio={sprintActivo.fechaInicio}
        fechaFin={sprintActivo.fechaFin}
        tareas={tareasFiltradas}
      />

      {/* ── Barra de filtros ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${tc.cardShadow} px-5 py-3`}
      >
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          {/* Búsqueda */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${tc.textMuted}`} />
            <input
              type="text"
              placeholder="Buscar tareas, features..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`${tc.input} pl-9 py-2 text-sm`}
            />
          </div>

          {/* Filtros rápidos */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFiltroMisTareas(!filtroMisPanel)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                filtroMisPanel
                  ? 'bg-light-accent/20 dark:bg-codaini-cyan/20 border-light-accent/40 dark:border-codaini-cyan/40 text-light-accent dark:text-codaini-cyan'
                  : `${tc.border} ${tc.surface2} ${tc.textMuted}`
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Mis tareas
            </button>

            <button
              onClick={() => setFiltrosOpen(!filtrosOpen)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                (filtroProyecto || filtroPrioridad || filtroTipo)
                  ? 'bg-light-accent/20 dark:bg-codaini-cyan/20 border-light-accent/40 dark:border-codaini-cyan/40 text-light-accent dark:text-codaini-cyan'
                  : `${tc.border} ${tc.surface2} ${tc.textMuted}`
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filtros
              {(filtroProyecto || filtroPrioridad || filtroTipo) && (
                <span className="w-4 h-4 rounded-full bg-light-accent dark:bg-codaini-cyan text-white dark:text-codaini-navy text-[9px] font-bold flex items-center justify-center">
                  {[filtroProyecto, filtroPrioridad, filtroTipo].filter(Boolean).length}
                </span>
              )}
            </button>

            {hayFiltros && (
              <button
                onClick={limpiarFiltros}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-red-700/40 bg-red-900/20 text-red-400 hover:bg-red-900/30 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Limpiar
              </button>
            )}

            <span className={`text-xs ${tc.textMuted} ml-1`}>
              {tareasFiltradas.length} tarea{tareasFiltradas.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Panel filtros extendido */}
        <AnimatePresence>
          {filtrosOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t ${tc.border}`}>
                {/* Proyecto */}
                <div>
                  <label className={`${tc.inputLabel} flex items-center gap-1`}>
                    <Hash className="w-3 h-3" /> Proyecto
                  </label>
                  <select value={filtroProyecto} onChange={e => setFiltroProyecto(e.target.value)} className={`${tc.input} text-sm`}>
                    <option value="">Todos los proyectos</option>
                    {proyectosList.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
                {/* Prioridad */}
                <div>
                  <label className={`${tc.inputLabel} flex items-center gap-1`}>
                    <Flag className="w-3 h-3" /> Prioridad
                  </label>
                  <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)} className={`${tc.input} text-sm`}>
                    <option value="">Todas</option>
                    {PRIORIDADES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                {/* Tipo */}
                <div>
                  <label className={`${tc.inputLabel} flex items-center gap-1`}>
                    <Tag className="w-3 h-3" /> Tipo
                  </label>
                  <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className={`${tc.input} text-sm`}>
                    <option value="">Todos</option>
                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Contenido principal por vista ── */}
      <AnimatePresence mode="wait">
        {vista === 'kanban' && (
          <motion.div key="kanban" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <KanbanBoard
              tareas={tareasFiltradas}
              onCardClick={handleCardClick}
              onMover={handleMoverFase}
            />
          </motion.div>
        )}

        {vista === 'lista' && (
          <motion.div key="lista" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ListView
              tareas={tareasFiltradas}
              onCardClick={handleCardClick}
              onMover={handleMoverFase}
            />
          </motion.div>
        )}

        {vista === 'metricas' && (
          <motion.div key="metricas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Distribución por fase */}
            <div className="bg-white dark:bg-codaini-navy-light border border-slate-200 dark:border-codaini-border rounded-xl shadow-sm dark:shadow-none p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-codaini-highlight mb-4">Distribución por fase</h3>
              <div className="space-y-3">
                {metricasPorFase.map(({ id, label, color, bg, count }) => {
                  const pct = tareasFiltradas.length > 0 ? Math.round((count / tareasFiltradas.length) * 100) : 0;
                  return (
                    <div key={id}>
                      <div className="flex justify-between mb-1">
                        <span className={`text-xs font-semibold ${color}`}>{label}</span>
                        <span className="text-xs text-slate-500 dark:text-codaini-muted">{count} ({pct}%)</span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-codaini-navy`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${bg.split(' ')[0].replace('bg-', 'bg-').replace('/10', '').replace('dark:', '')}`}
                          style={{ background: 'currentColor' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Distribución por prioridad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRIORIDADES.map(p => {
                const count = tareasFiltradas.filter(t => t.prioridad === p).length;
                const pct = tareasFiltradas.length > 0 ? Math.round((count / tareasFiltradas.length) * 100) : 0;
                const colors = {
                  Alta:  'text-red-600 dark:text-red-400 border-red-200 dark:border-red-700/40 bg-red-50 dark:bg-red-900/20',
                  Media: 'text-amber-600 dark:text-yellow-400 border-amber-200 dark:border-yellow-700/40 bg-amber-50 dark:bg-yellow-900/20',
                  Baja:  'text-green-600 dark:text-green-400 border-green-200 dark:border-green-700/40 bg-green-50 dark:bg-green-900/20',
                };
                return (
                  <div key={p} className={`bg-white dark:bg-codaini-navy-light rounded-xl shadow-sm dark:shadow-none border p-5 ${colors[p].split(' ').slice(1).join(' ')}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${colors[p].split(' ')[0]}`}>
                      Prioridad {p}
                    </p>
                    <p className={`text-3xl font-bold ${colors[p].split(' ')[0]}`}>{count}</p>
                    <p className="text-xs text-slate-500 dark:text-codaini-muted mt-1">{pct}% del total</p>
                  </div>
                );
              })}
            </div>

            {/* Distribución por tipo */}
            <div className="bg-white dark:bg-codaini-navy-light border border-slate-200 dark:border-codaini-border rounded-xl shadow-sm dark:shadow-none p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-codaini-highlight mb-4">Distribución por tipo</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {TIPOS.map(tipo => {
                  const count = tareasFiltradas.filter(t => t.tipo === tipo).length;
                  return (
                    <div key={tipo} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-codaini-border bg-slate-50 dark:bg-codaini-navy-lighter">
                      {tipoIcon[tipo]}
                      <span className="text-xl font-bold text-slate-800 dark:text-codaini-text">{count}</span>
                      <span className="text-[10px] text-slate-500 dark:text-codaini-muted text-center">{tipo}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top responsables */}
            <div className="bg-white dark:bg-codaini-navy-light border border-slate-200 dark:border-codaini-border rounded-xl shadow-sm dark:shadow-none p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-codaini-highlight mb-4">Carga por desarrollador</h3>
              {(() => {
                const resumen: Record<string, number> = {};
                tareasFiltradas.forEach(t => {
                  const r = t.responsable || 'Sin asignar';
                  resumen[r] = (resumen[r] || 0) + 1;
                });
                const ordenado = Object.entries(resumen).sort((a, b) => b[1] - a[1]);
                const max = ordenado[0]?.[1] ?? 1;
                return (
                  <div className="space-y-3">
                    {ordenado.length === 0 ? (
                      <p className={`text-sm ${tc.textMuted}`}>Sin datos</p>
                    ) : ordenado.map(([nombre, count]) => (
                      <div key={nombre} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-light-accent to-blue-500 dark:from-codaini-cyan dark:to-blue-400 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-white dark:text-codaini-navy">
                            {nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-1">
                            <span className={`text-xs font-medium ${tc.textPrimary} truncate`}>{nombre}</span>
                            <span className={`text-xs ${tc.textMuted} ml-2`}>{count}</span>
                          </div>
                          <div className={`h-1.5 rounded-full bg-light-surface-2 dark:bg-codaini-navy overflow-hidden`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(count / max) * 100}%` }}
                              transition={{ duration: 0.7 }}
                              className="h-full rounded-full bg-light-accent dark:bg-codaini-cyan"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal crear / editar ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditando(null); }}
        title={editando ? 'Editar tarea' : 'Nueva tarea'}
        subtitle={editando ? `Editando: ${editando.titulo}` : 'Agregar al tablero SCRUM'}
        size="lg"
      >
        <div className="space-y-4">
          {/* Fila 1: Tipo + Prioridad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`${tc.inputLabel} flex items-center gap-1`}>
                <Tag className="w-3 h-3" /> Tipo
              </label>
              <select name="tipo" value={form.tipo} onChange={handleChange} className={tc.input}>
                {TIPOS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`${tc.inputLabel} flex items-center gap-1`}>
                <Flag className="w-3 h-3" /> Prioridad *
              </label>
              <select name="prioridad" value={form.prioridad} onChange={handleChange} className={tc.input}>
                {PRIORIDADES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Título */}
          <div>
            <label className={tc.inputLabel}>Título *</label>
            <input
              type="text" name="titulo" value={form.titulo}
              onChange={handleChange} className={tc.input}
              placeholder="Ej: Implementar autenticación JWT"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className={tc.inputLabel}>Descripción</label>
            <textarea
              name="descripcion" value={form.descripcion}
              onChange={handleChange}
              className={`${tc.input} min-h-[80px] resize-y`}
              placeholder="Como [usuario], quiero [acción] para [objetivo]..."
            />
          </div>

          {/* ── Sección SCRUM: Repositorio + Feature ── */}
          <div className={`rounded-xl border border-light-accent/30 dark:border-codaini-cyan/30 bg-light-accent/5 dark:bg-codaini-cyan/5 p-4 space-y-3`}>
            <h4 className="text-xs font-bold text-light-accent dark:text-codaini-cyan uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" /> Desarrollo (obligatorio)
            </h4>

            <div>
              <label className={`${tc.inputLabel} flex items-center gap-1`}>
                <ExternalLink className="w-3 h-3" /> URL del repositorio *
              </label>
              <input
                type="url" name="repositorio" value={form.repositorio}
                onChange={handleChange} className={tc.input}
                placeholder="https://github.com/org/repositorio"
              />
            </div>

            <div>
              <label className={`${tc.inputLabel} flex items-center gap-1`}>
                <GitBranch className="w-3 h-3" /> Feature / Rama de trabajo *
              </label>
              <input
                type="text" name="feature" value={form.feature}
                onChange={handleChange} className={tc.input}
                placeholder="feature/login-jwt o bugfix/user-404"
              />
            </div>
          </div>

          {/* Sprint + Fase */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`${tc.inputLabel} flex items-center gap-1`}>
                <Layers className="w-3 h-3" /> Sprint
              </label>
              <select name="sprintId" value={form.sprintId} onChange={handleChange} className={tc.input}>
                {SPRINTS_DEMO.map(sp => (
                  <option key={sp.id} value={sp.id}>{sp.nombre} ({sp.estado})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={tc.inputLabel}>Fase inicial</label>
              <select name="fase" value={form.fase} onChange={handleChange} className={tc.input}>
                {FASES.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
              </select>
            </div>
          </div>

          {/* Proyecto + Responsable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={tc.inputLabel}>Proyecto</label>
              {proyectosList.length > 0 ? (
                <select name="proyectoId" value={form.proyectoId} onChange={handleChange} className={tc.input}>
                  <option value="">— Sin proyecto —</option>
                  {proyectosList.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              ) : (
                <input type="text" name="proyecto" value={form.proyecto} onChange={handleChange} className={tc.input} placeholder="Nombre del proyecto" />
              )}
            </div>
            <div>
              <label className={tc.inputLabel}>Responsable *</label>
              {trabajadoresList.length > 0 ? (
                <select name="responsableId" value={form.responsableId} onChange={handleChange} className={tc.input}>
                  <option value="">— Sin asignar —</option>
                  {trabajadoresList.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre} {(t as any).apellidos ?? ''} ({(t as any).cargo ?? 'Dev'})</option>
                  ))}
                </select>
              ) : (
                <input type="text" name="responsable" value={form.responsable} onChange={handleChange} className={tc.input} placeholder="Nombre del responsable" />
              )}
            </div>
          </div>

          {/* Fecha límite + Story points */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={tc.inputLabel}>Fecha límite</label>
              <input type="date" name="fechaLimite" value={form.fechaLimite} onChange={handleChange} className={tc.input} />
            </div>
            <div>
              <label className={`${tc.inputLabel} flex items-center gap-1`}>
                <Star className="w-3 h-3 text-purple-400" /> Story Points
              </label>
              <input
                type="number" name="storyPoints" value={form.storyPoints}
                onChange={handleChange} className={tc.input}
                placeholder="1, 2, 3, 5, 8, 13..."
                min="0" max="100"
              />
            </div>
          </div>

          {/* Etiquetas */}
          <div>
            <label className={`${tc.inputLabel} flex items-center gap-1`}>
              <Tag className="w-3 h-3" /> Etiquetas (separadas por coma)
            </label>
            <input
              type="text" name="etiquetas" value={form.etiquetas}
              onChange={handleChange} className={tc.input}
              placeholder="backend, auth, api, bug-fix..."
            />
          </div>

          {/* Acciones */}
          <div className={`flex justify-end gap-3 pt-2 border-t ${tc.border}`}>
            <Button variant="secondary" onClick={() => { setModalOpen(false); setEditando(null); }}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              icon={editando ? <RefreshCw className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              onClick={handleGuardar}
            >
              {editando ? 'Actualizar' : 'Crear tarea'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Panel de detalle de tarea ── */}
      <TaskDetailModal
        tarea={tareaDetalle}
        isOpen={detalleOpen}
        onClose={() => setDetalleOpen(false)}
        onMover={handleMoverFase}
        onEditar={abrirModalEditar}
        onEliminar={handleEliminar}
      />
    </div>
  );
};

export default Tareas;
