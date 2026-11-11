import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, CheckSquare, Users, UserCog, Clock, BookOpen, TrendingUp, Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import StatCard from '../components/dashboard/StatCard';
import { dashboardService } from '../services/api';
import { DashboardStats } from '../types';
import Badge from '../components/ui/Badge';
import Loading from '../components/ui/Loading';
import { tc, getChartColors } from '../utils/themeClasses';

const iconMap: Record<string, React.ElementType> = {
  Briefcase, CheckSquare, UserCog, BookOpen, Users, Clock, TrendingUp, Activity,
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const chart = getChartColors(isDark);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return <Loading text="Cargando dashboard..." fullPage />;
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className={`text-lg ${tc.textMuted}`}>No se pudieron cargar las estadísticas.</p>
      </div>
    );
  }

  const proyectosCompletados = stats.proyectosPorEstado.find((p) => p.name === 'Completado')?.value ?? 0;

  const CustomTooltip: React.FC<{ active?: boolean; payload?: Array<{ color?: string; name?: string; value?: number | string }>; label?: string }> = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className={`${tc.card} p-3 text-sm`}>
          <p className={`font-semibold ${tc.textPrimary} mb-1`}>{label}</p>
          {payload.map((p, i: number) => (
            <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  // ── Dashboard Administrador ───────────────────────────────────────────────
  if (user?.rol === 'Administrador') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-3xl font-bold ${tc.textHeading} mb-1`}>
            Bienvenido, {user.nombre}
          </h1>
          <p className={tc.textMuted}>Resumen general del sistema CODAINI</p>
        </motion.div>

        {/* Stats row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Proyectos"     value={stats.proyectosTotales}     icon={Briefcase}   color="primary"  trend={{ value: 12, isPositive: true }} />
          <StatCard title="Proyectos Activos"   value={stats.proyectosActivos}     icon={Activity}    color="success"  />
          <StatCard title="Tareas Pendientes"   value={stats.tareasPendientes}     icon={CheckSquare} color="warning"  />
          <StatCard title="Tareas Completadas"  value={stats.tareasCompletadas}    icon={CheckSquare} color="success"  />
        </div>

        {/* Stats row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Clientes"       value={stats.clientesTotal}      icon={Users}    color="info"    />
          <StatCard title="Trabajadores"   value={stats.trabajadoresTotal}  icon={UserCog}  color="primary" />
          <StatCard title="Asistencias Hoy" value={stats.asistenciasHoy}    icon={Clock}    color="success" />
          <StatCard title="Capacitaciones"  value={stats.capacitacionesTotal} icon={BookOpen} color="info"  />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`${tc.cardShadow} p-6`}>
            <h3 className={`text-lg font-bold ${tc.textHeading} mb-4`}>Proyectos por Estado</h3>
            <div>
              {stats.proyectosPorEstado.map((_, index) => (
                <div key={index} className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chart.palette[index % chart.palette.length] }} />
                  <span className={`text-sm ${tc.textMuted}`}>{stats.proyectosPorEstado[index].name}: {stats.proyectosPorEstado[index].value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Line chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className={`${tc.cardShadow} p-6`}>
            <h3 className={`text-lg font-bold ${tc.textHeading} mb-4`}>Tareas por Mes</h3>
            <div>
              {stats.tareasPorMes.map((m) => (
                <div key={m.mes} className="flex items-center gap-2 mb-1">
                  <span className={`text-sm ${tc.textMuted} w-8`}>{m.mes}</span>
                  <div className="flex-1 bg-light-surface-2 dark:bg-codaini-navy rounded-full h-1.5">
                    <div className="bg-light-accent dark:bg-codaini-cyan h-1.5 rounded-full" style={{ width: `${Math.min((m.tareas / 30) * 100, 100)}%` }} />
                  </div>
                  <span className={`text-xs ${tc.textMuted} w-8 text-right`}>{m.tareas}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Proyectos recientes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className={`${tc.cardShadow} p-6`}>
          <h3 className={`text-lg font-bold ${tc.textHeading} mb-4`}>Proyectos Recientes</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  {['Proyecto', 'Cliente', 'Responsable', 'Estado', 'Progreso', 'Fecha Límite'].map((h) => (
                    <th key={h} className={`px-4 py-3 text-left ${tc.tableHead}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${tc.divider}`}>
                {stats.proyectosRecientes.slice(0, 5).map((proyecto) => (
                  <tr key={proyecto.id} className={tc.tableRow}>
                    <td className={`px-4 py-3 text-sm font-medium ${tc.textPrimary}`}>{proyecto.nombre}</td>
                    <td className={tc.tableCellMuted}>{proyecto.cliente}</td>
                    <td className={tc.tableCellMuted}>{proyecto.responsable}</td>
                    <td className="px-4 py-3">
                      <Badge variant={proyecto.estado === 'Completado' ? 'success' : proyecto.estado === 'En progreso' ? 'info' : proyecto.estado === 'Cancelado' ? 'danger' : 'warning'} dot>
                        {proyecto.estado}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-light-surface-2 dark:bg-codaini-navy rounded-full h-1.5">
                          <div className="bg-light-accent dark:bg-codaini-cyan h-1.5 rounded-full transition-all" style={{ width: `${proyecto.progreso}%` }} />
                        </div>
                        <span className={`text-xs ${tc.textMuted}`}>{proyecto.progreso}%</span>
                      </div>
                    </td>
                    <td className={tc.tableCellMuted}>{new Date(proyecto.fechaLimite).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Actividad reciente */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className={`${tc.cardShadow} p-6`}>
          <h3 className={`text-lg font-bold ${tc.textHeading} mb-4`}>Actividad Reciente</h3>
          <div className="space-y-2">
            {stats.actividadReciente.map((item, i) => {
              const IconComponent = iconMap[item.icon] || Activity;
              return (
                <div key={i} className={`flex items-start space-x-3 p-3 rounded-lg ${tc.hoverCard} transition-colors cursor-default`}>
                  <div className={`p-2 rounded-lg flex-shrink-0 ${item.bg}`}>
                    <IconComponent className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${tc.textPrimary}`}>{item.title}</p>
                    <p className={`text-xs mt-0.5 ${tc.textMuted}`}>{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard Trabajador ──────────────────────────────────────────────────
  if (user?.rol === 'Trabajador') {
    const misTareasPendientes = stats.misTareas.filter((t) => t.estado === 'Pendiente');

    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-3xl font-bold ${tc.textHeading} mb-1`}>Bienvenido, {user.nombre}</h1>
          <p className={tc.textMuted}>Resumen de tus actividades</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Mis Proyectos"      value={stats.misProyectos.length}        icon={Briefcase}   color="primary" />
          <StatCard title="Mis Tareas"          value={stats.misTareas.length}            icon={CheckSquare} color="info"    />
          <StatCard title="Tareas Pendientes"   value={misTareasPendientes.length}        icon={Activity}    color="warning" />
          <StatCard title="Tareas Completadas"  value={stats.misTareasCompletadas}       icon={TrendingUp}  color="success" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`${tc.cardShadow} p-6`}>
          <h3 className={`text-lg font-bold ${tc.textHeading} mb-4`}>Mis Tareas Pendientes</h3>
          <div className="space-y-3">
            {misTareasPendientes.length === 0 ? (
              <p className={`text-center py-8 ${tc.textMuted}`}>Sin tareas pendientes. ¡Todo al día!</p>
            ) : misTareasPendientes.map((tarea) => (
              <div key={tarea.id} className={`p-4 border ${tc.border} rounded-lg ${tc.hoverCard} transition-colors`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold ${tc.textPrimary} truncate`}>{tarea.titulo}</h4>
                    <p className={`text-sm mt-0.5 ${tc.textMuted}`}>{tarea.proyecto}</p>
                  </div>
                  <Badge variant={tarea.prioridad === 'Alta' ? 'danger' : tarea.prioridad === 'Media' ? 'warning' : 'info'} dot>
                    {tarea.prioridad}
                  </Badge>
                </div>
                <p className={`text-xs mt-2 ${tc.textMuted}`}>
                  Fecha límite: {new Date(tarea.fechaLimite).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard Cliente/Usuario ─────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-3xl font-bold ${tc.textHeading} mb-1`}>Bienvenido, {user?.nombre}</h1>
        <p className={tc.textMuted}>Estado de tus proyectos</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Proyectos"   value={stats.proyectosTotales}                                               icon={Briefcase}   color="primary" />
        <StatCard title="En Progreso" value={stats.proyectosActivos}                                               icon={Activity}    color="info"    />
        <StatCard title="Completados" value={proyectosCompletados}                                                  icon={CheckSquare} color="success" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className={`${tc.cardShadow} p-6`}>
        <h3 className={`text-lg font-bold ${tc.textHeading} mb-4`}>Mis Proyectos</h3>
        <div className="space-y-4">
          {stats.misProyectos.slice(0, 3).map((proyecto) => (
            <div key={proyecto.id} className={`p-4 border ${tc.border} rounded-lg`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className={`font-semibold ${tc.textPrimary}`}>{proyecto.nombre}</h4>
                <Badge variant={proyecto.estado === 'Completado' ? 'success' : proyecto.estado === 'En progreso' ? 'info' : 'warning'} dot>
                  {proyecto.estado}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-light-surface-2 dark:bg-codaini-navy rounded-full h-2">
                  <div className="bg-light-accent dark:bg-codaini-cyan h-2 rounded-full transition-all" style={{ width: `${proyecto.progreso}%` }} />
                </div>
                <span className={`text-sm font-medium ${tc.textMuted} w-10 text-right`}>{proyecto.progreso}%</span>
              </div>
              <p className={`text-xs mt-2 ${tc.textMuted}`}>
                Fecha límite: {new Date(proyecto.fechaLimite).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
