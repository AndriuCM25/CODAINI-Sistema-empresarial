import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, ExternalLink, Clock, ChevronRight, Bug, Star, CheckCircle2, Zap, ChevronDown } from 'lucide-react';
import { Tarea, FaseTarea, TipoTarea, Prioridad } from '../../types';
import { FASES } from './KanbanBoard';

const prioridadDot: Record<Prioridad, string> = {
  Alta:  'bg-red-500 dark:bg-red-400',
  Media: 'bg-amber-500 dark:bg-amber-400',
  Baja:  'bg-green-500 dark:bg-green-400',
};

const tipoIcon: Record<TipoTarea, React.ReactNode> = {
  Historia: <Star className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />,
  Bug:      <Bug className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />,
  Tarea:    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />,
  Épica:    <Zap className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />,
  Subtarea: <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />,
};

function diasRestantes(fecha: string) {
  const diff = new Date(fecha).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

interface ListViewProps {
  tareas: Tarea[];
  onCardClick: (t: Tarea) => void;
  onMover: (id: string, fase: FaseTarea) => void;
}

const ListView: React.FC<ListViewProps> = ({ tareas, onCardClick, onMover }) => {
  const grupos = FASES.map((f) => ({
    fase: f,
    items: tareas.filter((t) => (t.fase || 'Por hacer') === f.id),
  })).filter((g) => g.items.length > 0);

  if (tareas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle2 className="w-12 h-12 text-slate-300 dark:text-codaini-muted mb-3" />
        <p className="text-sm text-slate-500 dark:text-codaini-muted">No hay tareas que mostrar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {grupos.map(({ fase, items }) => (
        <motion.div
          key={fase.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border overflow-hidden bg-white dark:bg-codaini-navy-light border-slate-200 dark:border-codaini-border shadow-sm dark:shadow-none"
        >
          {/* Cabecera del grupo */}
          <div className={`flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 dark:border-codaini-border ${fase.bg}`}>
            <span className={fase.color}>{fase.icon}</span>
            <span className={`text-xs font-bold uppercase tracking-wider ${fase.color}`}>{fase.label}</span>
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full border ${fase.bg} ${fase.color}`}>{items.length}</span>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 dark:text-codaini-muted border-b border-slate-100 dark:border-codaini-border bg-slate-50 dark:bg-codaini-navy/40">
                  <th className="text-left px-4 py-2.5 font-semibold w-8">#</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Tarea</th>
                  <th className="text-left px-4 py-2.5 font-semibold hidden md:table-cell">Feature / Rama</th>
                  <th className="text-left px-4 py-2.5 font-semibold hidden lg:table-cell">Responsable</th>
                  <th className="text-left px-4 py-2.5 font-semibold hidden lg:table-cell">Prioridad</th>
                  <th className="text-left px-4 py-2.5 font-semibold hidden xl:table-cell">Sprint</th>
                  <th className="text-left px-4 py-2.5 font-semibold">Fecha límite</th>
                  <th className="text-left px-4 py-2.5 font-semibold hidden md:table-cell">Mover a</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((t, idx) => {
                  const dias = diasRestantes(t.fechaLimite);
                  const vencida = dias < 0;
                  return (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => onCardClick(t)}
                      className="border-b border-slate-100 dark:border-codaini-border cursor-pointer hover:bg-slate-50 dark:hover:bg-codaini-navy-lighter transition-colors group"
                    >
                      {/* Nro */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {t.tipo && tipoIcon[t.tipo]}
                          <span className="text-[11px] font-mono text-slate-400 dark:text-codaini-muted">
                            #{t.id.slice(-4).toUpperCase()}
                          </span>
                        </div>
                      </td>

                      {/* Título */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-800 dark:text-codaini-text group-hover:text-teal-600 dark:group-hover:text-codaini-cyan transition-colors">
                          {t.titulo}
                        </span>
                        {t.etiquetas && t.etiquetas.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {t.etiquetas.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-teal-50 dark:bg-codaini-cyan/10 text-teal-700 dark:text-codaini-cyan border border-teal-100 dark:border-codaini-cyan/20">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Feature */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="space-y-1">
                          {t.feature && (
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-codaini-muted">
                              <GitBranch className="w-3 h-3 text-teal-600 dark:text-codaini-cyan" />
                              <span className="font-mono truncate max-w-[140px]">{t.feature}</span>
                            </div>
                          )}
                          {t.repositorio && (
                            <a
                              href={t.repositorio}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Repo</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Responsable */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 dark:from-codaini-cyan dark:to-blue-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-[9px] font-bold text-white">
                              {t.responsable ? t.responsable.charAt(0).toUpperCase() : '?'}
                            </span>
                          </div>
                          <span className="text-xs text-slate-600 dark:text-codaini-muted truncate max-w-[100px]">{t.responsable || 'Sin asignar'}</span>
                        </div>
                      </td>

                      {/* Prioridad */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${prioridadDot[t.prioridad]}`} />
                          <span className="text-xs text-slate-600 dark:text-codaini-muted">{t.prioridad}</span>
                        </div>
                      </td>

                      {/* Sprint */}
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">{t.sprint || '—'}</span>
                      </td>

                      {/* Fecha límite */}
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1 text-xs font-medium ${
                          vencida
                            ? 'text-red-600 dark:text-red-400'
                            : dias <= 2
                            ? 'text-amber-600 dark:text-yellow-400'
                            : 'text-slate-500 dark:text-codaini-muted'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {t.fechaLimite ? (
                            <span>{vencida ? 'Vencida' : dias === 0 ? 'Hoy' : dias === 1 ? 'Mañana' : t.fechaLimite}</span>
                          ) : '—'}
                        </div>
                      </td>

                      {/* Mover rápido */}
                      <td className="px-4 py-3 hidden md:table-cell" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={t.fase || 'Por hacer'}
                          onChange={(e) => onMover(t.id, e.target.value as FaseTarea)}
                          className="text-[11px] px-2 py-1 rounded-lg bg-slate-50 dark:bg-codaini-navy border border-slate-200 dark:border-codaini-border text-slate-600 dark:text-codaini-muted cursor-pointer"
                        >
                          {FASES.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                        </select>
                      </td>

                      {/* Flecha */}
                      <td className="px-2 py-3">
                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-codaini-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ListView;
