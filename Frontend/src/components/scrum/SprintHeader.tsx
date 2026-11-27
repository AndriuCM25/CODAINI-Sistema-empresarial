import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Target, Calendar, TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Tarea } from '../../types';

interface SprintHeaderProps {
  sprintNombre: string;
  sprintObjetivo: string;
  fechaInicio: string;
  fechaFin: string;
  tareas: Tarea[];
}

const SprintHeader: React.FC<SprintHeaderProps> = ({
  sprintNombre, sprintObjetivo, fechaInicio, fechaFin, tareas
}) => {
  const total = tareas.length;
  const hechas = tareas.filter(t => t.fase === 'Hecho').length;
  const enProgreso = tareas.filter(t => t.fase === 'En progreso').length;
  const bloqueadas = tareas.filter(t => t.prioridad === 'Alta' && t.fase !== 'Hecho').length;
  const progreso = total > 0 ? Math.round((hechas / total) * 100) : 0;

  const diasTotales = Math.ceil((new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / 86400000);
  const diasRestantes = Math.max(0, Math.ceil((new Date(fechaFin).getTime() - Date.now()) / 86400000));
  const diasTranscurridos = Math.max(0, diasTotales - diasRestantes);
  const progresoTiempo = diasTotales > 0 ? Math.round((diasTranscurridos / diasTotales) * 100) : 0;

  const totalSP = tareas.reduce((s, t) => s + (t.storyPoints || 0), 0);
  const spCompletados = tareas.filter(t => t.fase === 'Hecho').reduce((s, t) => s + (t.storyPoints || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-codaini-navy-light border border-slate-200 dark:border-codaini-border rounded-xl shadow-sm dark:shadow-none p-5 mb-5"
    >
      {/* Cabecera sprint */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-700/40 flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800 dark:text-codaini-highlight">{sprintNombre}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700/40 font-semibold">
                ACTIVO
              </span>
            </div>
            {sprintObjetivo && (
              <p className="text-xs text-slate-500 dark:text-codaini-muted flex items-center gap-1 mt-0.5">
                <Target className="w-3 h-3" /> {sprintObjetivo}
              </p>
            )}
          </div>
        </div>

        {/* Fechas */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-codaini-muted bg-slate-50 dark:bg-codaini-navy-lighter border border-slate-200 dark:border-codaini-border px-3 py-2 rounded-lg">
          <Calendar className="w-3.5 h-3.5" />
          <span>{fechaInicio}</span>
          <span>→</span>
          <span>{fechaFin}</span>
          <span className="ml-1 text-amber-600 dark:text-yellow-400 font-semibold">{diasRestantes}d restantes</span>
        </div>
      </div>

      {/* Barra de progreso principal */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-codaini-muted">Progreso del sprint</span>
          <span className={`text-xs font-bold ${progreso >= 80 ? 'text-emerald-600 dark:text-emerald-400' : progreso >= 50 ? 'text-amber-600 dark:text-yellow-400' : 'text-slate-400 dark:text-codaini-muted'}`}>
            {progreso}%
          </span>
        </div>
        <div className="relative h-2.5 rounded-full bg-slate-100 dark:bg-codaini-navy overflow-hidden">
          {/* Progreso tiempo (fondo) */}
          <div
            className="absolute inset-0 h-full rounded-full bg-blue-100 dark:bg-blue-900/40 transition-all duration-700"
            style={{ width: `${progresoTiempo}%` }}
          />
          {/* Progreso real */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progreso}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`absolute inset-0 h-full rounded-full ${progreso >= progresoTiempo ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-amber-500 dark:bg-yellow-400'}`}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-blue-600 dark:text-blue-400">▪ Tiempo: {progresoTiempo}%</span>
          <span className={`text-[10px] ${progreso >= progresoTiempo ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-yellow-400'}`}>
            ▪ Completado: {progreso}%
          </span>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Completadas */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl border border-emerald-200 dark:border-codaini-border bg-emerald-50 dark:bg-codaini-navy-lighter">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{hechas}</p>
            <p className="text-[10px] text-slate-500 dark:text-codaini-muted">Completadas</p>
          </div>
        </div>
        {/* En progreso */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl border border-amber-200 dark:border-codaini-border bg-amber-50 dark:bg-codaini-navy-lighter">
          <TrendingUp className="w-4 h-4 text-amber-600 dark:text-yellow-400 flex-shrink-0" />
          <div>
            <p className="text-lg font-bold text-amber-600 dark:text-yellow-400">{enProgreso}</p>
            <p className="text-[10px] text-slate-500 dark:text-codaini-muted">En progreso</p>
          </div>
        </div>
        {/* Alta prioridad */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl border border-red-200 dark:border-codaini-border bg-red-50 dark:bg-codaini-navy-lighter">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{bloqueadas}</p>
            <p className="text-[10px] text-slate-500 dark:text-codaini-muted">Alta prior.</p>
          </div>
        </div>
        {/* Story points / Total */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl border border-purple-200 dark:border-purple-700/40 bg-purple-50 dark:bg-purple-900/20">
          <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {totalSP > 0 ? `${spCompletados}/${totalSP}` : total}
            </p>
            <p className="text-[10px] text-purple-500 dark:text-purple-400/70">
              {totalSP > 0 ? 'Story pts' : 'Total tareas'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SprintHeader;
