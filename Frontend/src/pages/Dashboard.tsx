import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, CheckSquare, Users, UserCog, Clock, BookOpen, TrendingUp, Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import StatCard from '../components/dashboard/StatCard';
import {
  mockProyectos, mockTareas, mockClientes, mockTrabajadores,
  mockAsistencias, mockCapacitaciones,
} from '../data/mockData';
import Badge from '../components/ui/Badge';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { tc, getChartColors } from '../utils/themeClasses';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const chart = getChartColors(isDark);

  const proyectosActivos  = mockProyectos.filter((p) => p.estado === 'En progreso').length;
  const tareasPendientes  = mockTareas.filter((t) => t.estado === 'Pendiente').length;
  const tareasCompletadas = mockTareas.filter((t) => t.estado === 'Completada').length;
  const asistenciasHoy    = mockAsistencias.filter((a) => a.fecha === '2026-09-14').length;

  const proyectosPorEstado = [
    { name: 'Pendiente',   value: mockProyectos.filter((p) => p.estado === 'Pendiente').length },
    { name: 'En progreso', value: mockProyectos.filter((p) => p.estado === 'En progreso').length },
    { name: 'Completado',  value: mockProyectos.filter((p) => p.estado === 'Completado').length },
    { name: 'Cancelado',   value: mockProyectos.filter((p) => p.estado === 'Cancelado').length },
  ];

  const tareasPorMes = [
    { mes: 'Ene', tareas: 12 }, { mes: 'Feb', tareas: 15 }, { mes: 'Mar', tareas: 18 },
    { mes: 'Abr', tareas: 22 }, { mes: 'May', tareas: 20 }, { mes: 'Jun', tareas: 25 },
    { mes: 'Jul', tareas: 28 }, { mes: 'Ago', tareas: 30 }, { mes: 'Sep', tareas: 26 },
  ];

  // Componente de tooltip personalizado para Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className={`${tc.card} p-3 text-sm`}>
          <p className={`font-semibold ${tc.textPrimary} mb-1`}>{label}</p>
          {payload.map((p: any, i: number) => (
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
          <StatCard title="Total Proyectos"     value={mockProyectos.length}  icon={Briefcase}   color="primary"  trend={{ value: 12, isPositive: true }} />
          <StatCard title="Proyectos Activos"   value={proyectosActivos}       icon={Activity}    color="success"  />
          <StatCard title="Tareas Pendientes"   value={tareasPendientes}        icon={CheckSquare} color="warning"  />
          <StatCard title="Tareas Completadas"  value={tareasCompletadas}       icon={CheckSquare} color="success"  />
        </div>

        {/* Stats row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Clientes"       value={mockClientes.length}    icon={Users}    color="info"    />
          <StatCard title="Trabajadores"   value={mockTrabajadores.length} icon={UserCog}  color="primary" />
          <StatCard title="Asistencias Hoy" value={asistenciasHoy}         icon={Clock}    color="success" />
          <StatCard title="Capacitaciones"  value={mockCapacitaciones.length} icon={BookOpen} color="info"  />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`${tc.cardShadow} p-6`}>
            <h3 className={`text-lg font-bold ${tc.textHeading} mb-4`}>Proyectos por Estado</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={proyectosPorEstado} cx="50%" cy="50%" labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100} dataKey="value">
                  {proyectosPorEstado.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={chart.palette[index % chart.palette.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Line chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className={`${tc.cardShadow} p-6`}>
            <h3 className={`text-lg font-bold ${tc.textHeading} mb-4`}>Tareas por Mes</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={tareasPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                <XAxis dataKey="mes" tick={{ fill: chart.axis }} axisLine={{ stroke: chart.grid }} />
                <YAxis tick={{ fill: chart.axis }} axisLine={{ stroke: chart.grid }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: chart.axis }} />
                <Line type="monotone" dataKey="tareas" stroke={chart.primary} strokeWidth={3} name="Tareas" dot={{ fill: chart.primary }} />
              </LineChart>
            </ResponsiveContainer>
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
                {mockProyectos.slice(0, 5).map((proyecto) => (
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
                          <div className="bg-codaini-cyan dark:bg-codaini-cyan h-1.5 rounded-full bg-light-accent transition-all" style={{ width: `${proyecto.progreso}%` }} />
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
            {[
              { icon: Briefcase,  color: 'text-green-500',  bg: 'bg-green-500/10',  title: 'Nuevo proyecto registrado',     sub: 'Portal Web Corporativo — Hace 2 horas' },
              { icon: CheckSquare,color: 'text-blue-500',   bg: 'bg-blue-500/10',   title: 'Tarea completada',               sub: 'Testing de la plataforma — Hace 5 horas' },
              { icon: UserCog,    color: 'text-purple-500', bg: 'bg-purple-500/10', title: 'Nuevo trabajador registrado',    sub: 'Luis Fernández — Hace 1 día' },
              { icon: BookOpen,   color: 'text-yellow-500', bg: 'bg-yellow-500/10', title: 'Nueva capacitación programada',  sub: 'Desarrollo en React — 20 de septiembre' },
            ].map((item, i) => (
              <div key={i} className={`flex items-start space-x-3 p-3 rounded-lg ${tc.hoverCard} transition-colors cursor-default`}>
                <div className={`p-2 rounded-lg flex-shrink-0 ${item.bg}`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${tc.textPrimary}`}>{item.title}</p>
                  <p className={`text-xs mt-0.5 ${tc.textMuted}`}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard Trabajador ──────────────────────────────────────────────────
  if (user?.rol === 'Trabajador') {
    const misProyectos       = mockProyectos.filter((p) => p.responsableId === user.id);
    const misTareas          = mockTareas.filter((t) => t.responsableId === user.id);
    const misTareasPendientes = misTareas.filter((t) => t.estado === 'Pendiente');
    const misTareasCompletadas = misTareas.filter((t) => t.estado === 'Completada');

    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-3xl font-bold ${tc.textHeading} mb-1`}>Bienvenido, {user.nombre}</h1>
          <p className={tc.textMuted}>Resumen de tus actividades</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Mis Proyectos"      value={misProyectos.length}        icon={Briefcase}   color="primary" />
          <StatCard title="Mis Tareas"          value={misTareas.length}            icon={CheckSquare} color="info"    />
          <StatCard title="Tareas Pendientes"   value={misTareasPendientes.length}  icon={Activity}    color="warning" />
          <StatCard title="Tareas Completadas"  value={misTareasCompletadas.length} icon={TrendingUp}  color="success" />
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
        <StatCard title="Proyectos"   value={mockProyectos.length}                                               icon={Briefcase}   color="primary" />
        <StatCard title="En Progreso" value={proyectosActivos}                                                   icon={Activity}    color="info"    />
        <StatCard title="Completados" value={mockProyectos.filter((p) => p.estado === 'Completado').length}      icon={CheckSquare} color="success" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className={`${tc.cardShadow} p-6`}>
        <h3 className={`text-lg font-bold ${tc.textHeading} mb-4`}>Mis Proyectos</h3>
        <div className="space-y-4">
          {mockProyectos.slice(0, 3).map((proyecto) => (
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
