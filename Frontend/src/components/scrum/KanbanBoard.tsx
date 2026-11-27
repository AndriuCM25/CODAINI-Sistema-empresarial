import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, ExternalLink, Clock, AlertCircle, CheckCircle2,
  CircleDot, BookOpen, Bug, Zap, ChevronDown, MessageSquare,
  Star, User, Calendar
} from 'lucide-react';
import { Tarea, FaseTarea, Prioridad, TipoTarea } from '../../types';
import { tc } from '../../utils/themeClasses';
import Badge from '../ui/Badge';

// ── Configuración de columnas ────────────────────────────────────────────
export const FASES: { id: FaseTarea; label: string; color: string; colorDark: string; bg: string; icon: React.ReactNode }[] = [
  {
    id: 'Backlog',
    label: 'Backlog',
    color: 'text-slate-600 dark:text-slate-400',
    colorDark: 'text-slate-400',
    bg: 'bg-slate-100 border-slate-300 dark:bg-slate-500/10 dark:border-slate-500/20',
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  {
    id: 'Por hacer',
    label: 'Por hacer',
    color: 'text-blue-600 dark:text-blue-400',
    colorDark: 'text-blue-400',
    bg: 'bg-blue-50 border-blue-300 dark:bg-blue-500/10 dark:border-blue-500/20',
    icon: <CircleDot className="w-3.5 h-3.5" />,
  },
  {
    id: 'En progreso',
    label: 'En progreso',
    color: 'text-amber-600 dark:text-yellow-400',
    colorDark: 'text-yellow-400',
    bg: 'bg-amber-50 border-amber-300 dark:bg-yellow-500/10 dark:border-yellow-500/20',
    icon: <Zap className="w-3.5 h-3.5" />,
  },
  {
    id: 'En revisión',
    label: 'En revisión',
    color: 'text-purple-600 dark:text-purple-400',
    colorDark: 'text-purple-400',
    bg: 'bg-purple-50 border-purple-300 dark:bg-purple-500/10 dark:border-purple-500/20',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  {
    id: 'Hecho',
    label: 'Hecho',
    color: 'text-emerald-600 dark:text-emerald-400',
    colorDark: 'text-emerald-400',
    bg: 'bg-emerald-50 border-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────
const prioridadColor: Record<Prioridad, string> = {
  Alta:  'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700/40',
  Media: 'text-amber-700 dark:text-yellow-400 bg-amber-100 dark:bg-yellow-900/30 border-amber-300 dark:border-yellow-700/40',
  Baja:  'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700/40',
};

const tipoIcon: Record<TipoTarea, React.ReactNode> = {
  Historia: <Star className="w-3 h-3 text-blue-400" />,
  Bug: <Bug className="w-3 h-3 text-red-400" />,
  Tarea: <CheckCircle2 className="w-3 h-3 text-teal-400" />,
  Épica: <Zap className="w-3 h-3 text-purple-400" />,
  Subtarea: <ChevronDown className="w-3 h-3 text-slate-400" />,
};

function isVencida(fecha: string) {
  return new Date(fecha) < new Date() && fecha !== '';
}

function diasRestantes(fecha: string) {
  const diff = new Date(fecha).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

// ── Tarjeta individual ───────────────────────────────────────────────────
interface TareaCardProps {
  tarea: Tarea;
  onClick: (t: Tarea) => void;
  onMover: (id: string, fase: FaseTarea) => void;
}

const TareaCard: React.FC<TareaCardProps> = ({ tarea, onClick, onMover }) => {
  const vencida = isVencida(tarea.fechaLimite);
  const dias = diasRestantes(tarea.fechaLimite);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={() => onClick(tarea)}
      className={`
        group cursor-pointer rounded-xl border p-3.5 mb-2.5
        bg-white dark:bg-codaini-navy-light
        border-slate-200 dark:border-codaini-border
        hover:border-light-accent dark:hover:border-codaini-cyan/50
        hover:shadow-md hover:shadow-slate-200/80 dark:hover:shadow-codaini-cyan/5
        transition-all duration-200 select-none
      `}
    >
      {/* Fila superior: tipo + prioridad */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {tarea.tipo && tipoIcon[tarea.tipo]}
          <span className="text-xs text-slate-400 dark:text-codaini-muted font-mono">
            #{tarea.id.slice(-4).toUpperCase()}
          </span>
        </div>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${prioridadColor[tarea.prioridad]}`}>
          {tarea.prioridad}
        </span>
      </div>

      {/* Título */}
      <p className={`text-sm font-semibold leading-snug mb-2.5 text-slate-800 dark:text-codaini-text group-hover:text-light-accent dark:group-hover:text-codaini-cyan line-clamp-2 transition-colors`}>
        {tarea.titulo}
      </p>

      {/* Repositorio + Feature */}
      {(tarea.repositorio || tarea.feature) && (
        <div className="space-y-1 mb-2.5">
          {tarea.feature && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-codaini-muted">
              <GitBranch className="w-3 h-3 flex-shrink-0 text-teal-600 dark:text-codaini-cyan" />
              <span className="font-mono truncate max-w-[180px]">{tarea.feature}</span>
            </div>
          )}
          {tarea.repositorio && (
            <a
              href={tarea.repositorio}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
            >
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
              <span className="truncate max-w-[180px]">Repositorio</span>
            </a>
          )}
        </div>
      )}

      {/* Etiquetas */}
      {tarea.etiquetas && tarea.etiquetas.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {tarea.etiquetas.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-teal-50 dark:bg-codaini-cyan/10 text-teal-700 dark:text-codaini-cyan border border-teal-200 dark:border-codaini-cyan/20">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Pie de tarjeta */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-codaini-border/60">
        {/* Responsable */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 dark:from-codaini-cyan dark:to-blue-400 flex items-center justify-center">
            <span className="text-[9px] font-bold text-white">
              {tarea.responsable ? tarea.responsable.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-codaini-muted truncate max-w-[80px]">
            {tarea.responsable || 'Sin asignar'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Story points */}
          {tarea.storyPoints !== undefined && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/40 font-mono">
              {tarea.storyPoints}sp
            </span>
          )}
          {/* Fecha */}
          <div className={`flex items-center gap-1 text-[10px] ${vencida ? 'text-red-600 dark:text-red-400' : dias <= 2 ? 'text-amber-600 dark:text-yellow-400' : 'text-slate-400 dark:text-codaini-muted'}`}>
            <Clock className="w-3 h-3" />
            {vencida ? 'Vencida' : dias === 0 ? 'Hoy' : dias === 1 ? 'Mañana' : `${dias}d`}
          </div>
          {/* Comentarios */}
          {(tarea.comentarios ?? 0) > 0 && (
            <div className="flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-codaini-muted">
              <MessageSquare className="w-3 h-3" />
              {tarea.comentarios}
            </div>
          )}
        </div>
      </div>

      {/* Selector rápido de fase (hover) */}
      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <select
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => { e.stopPropagation(); onMover(tarea.id, e.target.value as FaseTarea); }}
          value={tarea.fase || 'Por hacer'}
          className="w-full text-[11px] px-2 py-1 rounded-lg bg-slate-50 dark:bg-codaini-navy border border-slate-200 dark:border-codaini-border text-slate-600 dark:text-codaini-muted cursor-pointer"
        >
          {FASES.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
        </select>
      </div>
    </motion.div>
  );
};

// ── Columna Kanban ───────────────────────────────────────────────────────
interface ColumnaProps {
  fase: typeof FASES[0];
  tareas: Tarea[];
  onCardClick: (t: Tarea) => void;
  onMover: (id: string, fase: FaseTarea) => void;
}

const Columna: React.FC<ColumnaProps> = ({ fase, tareas, onCardClick, onMover }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-w-[260px] max-w-[300px] flex-1">
      {/* Header columna */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 rounded-xl mb-3 border ${fase.bg} cursor-pointer select-none`}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className={`flex items-center gap-2 ${fase.color}`}>
          {fase.icon}
          <span className="text-xs font-bold tracking-wide uppercase">{fase.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${fase.bg} ${fase.color}`}>
            {tareas.length}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 ${fase.color} transition-transform ${collapsed ? '-rotate-90' : ''}`} />
        </div>
      </div>

      {/* Tarjetas */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-1 overflow-y-auto pr-0.5 min-h-[100px]"
            style={{ maxHeight: 'calc(100vh - 300px)' }}
          >
            <AnimatePresence>
              {tareas.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className={`w-10 h-10 rounded-xl ${fase.bg} border flex items-center justify-center mb-2`}>
                    <span className={fase.color}>{fase.icon}</span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-codaini-muted">Sin tareas</p>
                </motion.div>
              ) : (
                tareas.map((t) => (
                  <TareaCard key={t.id} tarea={t} onClick={onCardClick} onMover={onMover} />
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── KanbanBoard principal ─────────────────────────────────────────────────
interface KanbanBoardProps {
  tareas: Tarea[];
  onCardClick: (t: Tarea) => void;
  onMover: (id: string, fase: FaseTarea) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tareas, onCardClick, onMover }) => {
  const tareasPorFase = (fase: FaseTarea) =>
    tareas.filter((t) => (t.fase || 'Por hacer') === fase);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 min-h-[400px]">
      {FASES.map((fase) => (
        <Columna
          key={fase.id}
          fase={fase}
          tareas={tareasPorFase(fase.id)}
          onCardClick={onCardClick}
          onMover={onMover}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
