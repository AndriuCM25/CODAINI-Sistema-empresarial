import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, GitBranch, ExternalLink, Clock, Calendar, User,
  Tag, Layers, Flag, CheckCircle2, Bug, Star, Zap, ChevronDown,
  Edit2, Trash2, ArrowRight
} from 'lucide-react';
import { Tarea, FaseTarea, TipoTarea } from '../../types';
import { FASES } from './KanbanBoard';
import { tc } from '../../utils/themeClasses';

const tipoConfig: Record<TipoTarea, { icon: React.ReactNode; label: string; color: string }> = {
  Historia: { icon: <Star className="w-4 h-4" />,        label: 'Historia de Usuario', color: 'text-blue-600 dark:text-blue-400' },
  Bug:      { icon: <Bug className="w-4 h-4" />,         label: 'Bug',                 color: 'text-red-600 dark:text-red-400' },
  Tarea:    { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Tarea',               color: 'text-teal-600 dark:text-teal-400' },
  Épica:    { icon: <Zap className="w-4 h-4" />,         label: 'Épica',               color: 'text-purple-600 dark:text-purple-400' },
  Subtarea: { icon: <ChevronDown className="w-4 h-4" />, label: 'Subtarea',            color: 'text-slate-500 dark:text-slate-400' },
};

const prioridadConfig = {
  Alta:  { color: 'text-red-600 dark:text-red-400',      bg: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700/40' },
  Media: { color: 'text-amber-600 dark:text-yellow-400', bg: 'bg-amber-50 dark:bg-yellow-900/30 border-amber-200 dark:border-yellow-700/40' },
  Baja:  { color: 'text-green-600 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700/40' },
};

function diasRestantes(fecha: string) {
  const diff = new Date(fecha).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

interface TaskDetailModalProps {
  tarea: Tarea | null;
  isOpen: boolean;
  onClose: () => void;
  onMover: (id: string, fase: FaseTarea) => void;
  onEditar: (tarea: Tarea) => void;
  onEliminar: (id: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  tarea, isOpen, onClose, onMover, onEditar, onEliminar
}) => {
  if (!tarea) return null;
  const faseActual = FASES.find(f => f.id === (tarea.fase || 'Por hacer'));
  const pConfig = prioridadConfig[tarea.prioridad];
  const tConfig = tarea.tipo ? tipoConfig[tarea.tipo] : null;
  const dias = diasRestantes(tarea.fechaLimite);
  const vencida = dias < 0;

  const idxActual = FASES.findIndex(f => f.id === (tarea.fase || 'Por hacer'));
  const siguienteFase = FASES[idxActual + 1] ?? null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Panel deslizante */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl z-50 bg-white dark:bg-codaini-navy-light border-l border-slate-200 dark:border-codaini-border shadow-2xl dark:shadow-none overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-codaini-border flex-shrink-0 bg-slate-50 dark:bg-codaini-navy/50">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {tConfig && <span className={tConfig.color}>{tConfig.icon}</span>}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] font-mono text-slate-400 dark:text-codaini-muted">
                      #{tarea.id.slice(-6).toUpperCase()}
                    </span>
                    {tConfig && (
                      <span className={`text-[10px] font-semibold ${tConfig.color}`}>{tConfig.label}</span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-codaini-highlight leading-snug">
                    {tarea.titulo}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                <button
                  onClick={() => onEditar(tarea)}
                  className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-codaini-navy-lighter text-slate-500 dark:text-codaini-muted transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEliminar(tarea.id)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 dark:text-codaini-muted hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-codaini-navy-lighter text-slate-500 dark:text-codaini-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contenido scrollable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">

              {/* Mover a siguiente fase */}
              {siguienteFase && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onMover(tarea.id, siguienteFase.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border ${siguienteFase.bg} cursor-pointer transition-all`}
                >
                  <div className={`flex items-center gap-2 ${siguienteFase.color}`}>
                    {siguienteFase.icon}
                    <span className="text-sm font-semibold">Mover a: {siguienteFase.label}</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${siguienteFase.color}`} />
                </motion.button>
              )}

              {/* Selector de fase completo */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-codaini-muted uppercase tracking-wider mb-2 block">
                  Fase actual
                </label>
                <select
                  value={tarea.fase || 'Por hacer'}
                  onChange={(e) => onMover(tarea.id, e.target.value as FaseTarea)}
                  className={`${tc.input} text-sm`}
                >
                  {FASES.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-3">

                {/* Fase actual */}
                {faseActual && (
                  <div className={`flex items-center gap-2 p-3 rounded-xl border ${faseActual.bg}`}>
                    <span className={faseActual.color}>{faseActual.icon}</span>
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-codaini-muted">Fase</p>
                      <p className={`text-xs font-semibold ${faseActual.color}`}>{faseActual.label}</p>
                    </div>
                  </div>
                )}

                {/* Prioridad */}
                <div className={`flex items-center gap-2 p-3 rounded-xl border ${pConfig.bg}`}>
                  <Flag className={`w-4 h-4 ${pConfig.color}`} />
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-codaini-muted">Prioridad</p>
                    <p className={`text-xs font-semibold ${pConfig.color}`}>{tarea.prioridad}</p>
                  </div>
                </div>

                {/* Responsable */}
                <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-codaini-border bg-slate-50 dark:bg-codaini-navy-lighter">
                  <User className="w-4 h-4 text-slate-500 dark:text-codaini-muted" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500 dark:text-codaini-muted">Responsable</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-codaini-text truncate">{tarea.responsable || 'Sin asignar'}</p>
                  </div>
                </div>

                {/* Fecha límite */}
                <div className={`flex items-center gap-2 p-3 rounded-xl border ${
                  vencida
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/40'
                    : 'border-slate-200 dark:border-codaini-border bg-slate-50 dark:bg-codaini-navy-lighter'
                }`}>
                  <Clock className={`w-4 h-4 ${vencida ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-codaini-muted'}`} />
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-codaini-muted">Fecha límite</p>
                    <p className={`text-xs font-semibold ${
                      vencida ? 'text-red-600 dark:text-red-400'
                      : dias <= 2 ? 'text-amber-600 dark:text-yellow-400'
                      : 'text-slate-700 dark:text-codaini-text'
                    }`}>
                      {tarea.fechaLimite || '—'}
                      {tarea.fechaLimite && (
                        <span className="ml-1 text-[10px] opacity-70">
                          ({vencida ? `hace ${Math.abs(dias)}d` : dias === 0 ? 'hoy' : `en ${dias}d`})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Sprint */}
                {tarea.sprint && (
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-purple-200 dark:border-purple-700/40 bg-purple-50 dark:bg-purple-900/20">
                    <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-codaini-muted">Sprint</p>
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">{tarea.sprint}</p>
                    </div>
                  </div>
                )}

                {/* Story points */}
                {tarea.storyPoints !== undefined && (
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-indigo-200 dark:border-indigo-700/40 bg-indigo-50 dark:bg-indigo-900/20">
                    <Star className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-codaini-muted">Story Points</p>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{tarea.storyPoints} pts</p>
                    </div>
                  </div>
                )}

                {/* Proyecto */}
                <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-codaini-border bg-slate-50 dark:bg-codaini-navy-lighter col-span-2">
                  <Calendar className="w-4 h-4 text-slate-500 dark:text-codaini-muted" />
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-codaini-muted">Proyecto</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-codaini-text">{tarea.proyecto || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Repositorio + Feature */}
              {(tarea.repositorio || tarea.feature) && (
                <div className="rounded-xl border border-teal-200 dark:border-codaini-border bg-teal-50 dark:bg-codaini-navy-lighter p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-codaini-muted">
                    Desarrollo
                  </h3>
                  {tarea.feature && (
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-teal-600 dark:text-codaini-cyan flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 dark:text-codaini-muted">Feature / Rama</p>
                        <code className="text-xs text-teal-700 dark:text-codaini-cyan font-mono break-all">
                          {tarea.feature}
                        </code>
                      </div>
                    </div>
                  )}
                  {tarea.repositorio && (
                    <div className="flex items-start gap-2">
                      <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-slate-500 dark:text-codaini-muted mb-1">Repositorio</p>
                        <a
                          href={tarea.repositorio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline break-all"
                        >
                          {tarea.repositorio}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Descripción */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-codaini-muted mb-2">
                  Descripción
                </h3>
                <p className="text-sm text-slate-700 dark:text-codaini-text leading-relaxed whitespace-pre-wrap">
                  {tarea.descripcion || 'Sin descripción.'}
                </p>
              </div>

              {/* Etiquetas */}
              {tarea.etiquetas && tarea.etiquetas.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-codaini-muted mb-2 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Etiquetas
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {tarea.etiquetas.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-teal-50 dark:bg-codaini-cyan/10 text-teal-700 dark:text-codaini-cyan border border-teal-200 dark:border-codaini-cyan/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Fecha creación */}
              <div className="text-xs text-slate-400 dark:text-codaini-muted pt-2 border-t border-slate-200 dark:border-codaini-border">
                Creada el {tarea.fechaCreacion || '—'}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailModal;
