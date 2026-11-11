import {
  Usuario,
  Cliente,
  Proyecto,
  Tarea,
  Asistencia,
  Capacitacion,
  UsuarioApi,
  ClienteApi,
  ProyectoApi,
  TareaApi,
  AsistenciaApi,
  CapacitacionApi,
  CapacitacionProximaApi,
  DashboardStats,
  DashboardResumen,
  DashboardGraficos,
} from '../types';
import type { RolType, EstadoProyecto, EstadoTarea, Prioridad, EstadoAsistencia, EstadoCapacitacion } from '../types';

// ─── Entity Mappers (API → Frontend) ───

export const mapUsuario = (api: UsuarioApi & { apellidos?: string }): Usuario => {
  const nombreCompleto = (api.nombre || '').trim();
  const parts = nombreCompleto.split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = api.apellidos || (parts.length > 1 ? parts.slice(1).join(' ') : '');
  const iniciales = (
    (firstName[0] || '') + (lastName[0] || firstName[1] || '')
  ).toUpperCase();

  return {
    id: String(api.id),
    nombre: api.apellidos ? api.nombre : firstName,
    apellidos: lastName,
    email: api.email,
    telefono: api.telefono ?? '',
    rol: (api.rol as RolType) || 'Cliente',
    estado: (api.estado as 'Activo' | 'Inactivo') || 'Activo',
    fechaRegistro: api.created_at,
    iniciales,
  };
};

export const mapCliente = (api: ClienteApi): Cliente => ({
  id: String(api.id),
  empresa: api.nombre_empresa,
  ruc: api.ruc,
  contacto: api.contacto_nombre,
  email: api.email,
  telefono: api.telefono ?? '',
  estado: (api.estado as 'Activo' | 'Inactivo') || 'Activo',
  fechaRegistro: api.created_at,
});

export const mapProyecto = (
  api: ProyectoApi & {
    cliente_nombre?: string;
    responsable_nombre?: string;
    fecha_fin_estimada?: string;
    progreso?: number;
  }
): Proyecto => {
  const progresoCalculado =
    typeof api.progreso === 'number'
      ? api.progreso
      : api.estado === 'Completado'
      ? 100
      : api.estado === 'En Progreso' || api.estado === 'En progreso'
      ? 55
      : 0;

  const fechaLimiteValida =
    api.fecha_limite || api.fecha_fin_estimada || api.fecha_inicio || new Date().toISOString().split('T')[0];

  return {
    id: String(api.id),
    nombre: api.nombre,
    descripcion: api.descripcion || '',
    clienteId: String(api.cliente_id || ''),
    cliente: api.cliente?.nombre_empresa || api.cliente_nombre || 'Cliente General',
    responsableId: String(api.responsable_id || ''),
    responsable: api.responsable?.nombre || api.responsable_nombre || 'No asignado',
    estado: (api.estado as EstadoProyecto) || 'Pendiente',
    progreso: progresoCalculado,
    fechaInicio: api.fecha_inicio || new Date().toISOString().split('T')[0],
    fechaLimite: fechaLimiteValida,
    presupuesto: api.presupuesto ? Number(api.presupuesto) : undefined,
  };
};

export const mapTarea = (
  api: TareaApi & {
    proyecto_nombre?: string;
    asignado_nombre?: string;
    asignado_a?: number;
    fecha_vencimiento?: string;
    created_at?: string;
  }
): Tarea => ({
  id: String(api.id),
  titulo: api.titulo,
  descripcion: api.descripcion || '',
  proyectoId: String(api.proyecto_id || ''),
  proyecto: api.proyecto?.nombre || api.proyecto_nombre || 'Proyecto General',
  responsableId: String(api.responsable_id || api.asignado_a || ''),
  responsable: api.responsable?.nombre || api.asignado_nombre || 'Sin asignar',
  prioridad: (api.prioridad as Prioridad) || 'Media',
  estado: (api.estado as EstadoTarea) || 'Pendiente',
  fechaCreacion: api.fecha_creacion || api.created_at || new Date().toISOString().split('T')[0],
  fechaLimite: api.fecha_limite || api.fecha_vencimiento || new Date().toISOString().split('T')[0],
});

export const mapAsistencia = (
  api: AsistenciaApi & {
    usuario_nombre?: string;
    usuario_email?: string;
    usuario_id?: number;
  }
): Asistencia => ({
  id: String(api.id),
  trabajadorId: String(api.trabajador_id || api.usuario_id || ''),
  trabajador: api.trabajador?.nombre || api.usuario_nombre || 'Trabajador',
  fecha: api.fecha,
  horaEntrada: api.hora_entrada,
  horaSalida: api.hora_salida || undefined,
  estado: (api.estado as EstadoAsistencia) || 'Presente',
});

export const mapCapacitacion = (
  api: CapacitacionApi & {
    tema?: string;
    total_participantes?: number;
  }
): Capacitacion => ({
  id: String(api.id),
  nombre: api.nombre || api.tema || 'Capacitación Empresarial',
  descripcion: api.descripcion || `Capacitación institucional CODAINI sobre ${api.tema || api.nombre || 'temas de empresa'}`,
  instructor: api.instructor,
  fecha: api.fecha,
  hora: api.hora,
  duracion: api.duracion || '1h 30m',
  participantes: api.participantes_ids?.map(String) || [],
  numeroParticipantes: api.numero_participantes ?? api.total_participantes ?? 0,
  estado: (api.estado as EstadoCapacitacion) || 'Programada',
  ubicacion: api.ubicacion || 'Auditorio Central / Plataforma Virtual',
});

export const mapCapacitacionProxima = (api: CapacitacionProximaApi) => ({
  id: String(api.id),
  nombre: api.tema,
  fecha: api.fecha,
  instructor: api.instructor,
});

// ─── Request Mappers (Frontend → API) ───

export const mapClienteRequest = (data: Partial<Cliente>): Record<string, unknown> => ({
  nombre_empresa: data.empresa,
  ruc: data.ruc,
  contacto_nombre: data.contacto,
  email: data.email,
  telefono: data.telefono,
  estado: data.estado || 'Activo',
});

export const mapProyectoRequest = (data: Partial<Proyecto>): Record<string, unknown> => ({
  nombre: data.nombre,
  descripcion: data.descripcion,
  cliente_id: data.clienteId ? Number(data.clienteId) : undefined,
  cliente: data.cliente,
  responsable_id: data.responsableId ? Number(data.responsableId) : undefined,
  responsable: data.responsable,
  estado: data.estado || 'Pendiente',
  fecha_inicio: data.fechaInicio || new Date().toISOString().split('T')[0],
  fecha_limite: data.fechaLimite,
  fecha_fin_estimada: data.fechaLimite,
  presupuesto: data.presupuesto,
});

export const mapTareaRequest = (data: Partial<Tarea>): Record<string, unknown> => ({
  titulo: data.titulo,
  descripcion: data.descripcion,
  proyecto_id: data.proyectoId ? Number(data.proyectoId) : undefined,
  proyecto: data.proyecto,
  responsable_id: data.responsableId ? Number(data.responsableId) : undefined,
  asignado_a: data.responsableId ? Number(data.responsableId) : undefined,
  prioridad: data.prioridad || 'Media',
  estado: data.estado || 'Pendiente',
  fecha_limite: data.fechaLimite,
  fecha_vencimiento: data.fechaLimite,
});

export const mapCapacitacionRequest = (data: Partial<Capacitacion>): Record<string, unknown> => ({
  tema: data.nombre,
  nombre: data.nombre,
  descripcion: data.descripcion,
  instructor: data.instructor,
  fecha: data.fecha,
  hora: data.hora,
  duracion: data.duracion,
  participantes_ids: data.participantes?.map(Number),
  estado: data.estado || 'Programada',
  ubicacion: data.ubicacion,
});

// ─── Array helpers ───

export const mapUsuarios = (arr: UsuarioApi[]): Usuario[] => arr.map(mapUsuario);
export const mapClientes = (arr: ClienteApi[]): Cliente[] => arr.map(mapCliente);
export const mapProyectos = (arr: ProyectoApi[]): Proyecto[] => arr.map(mapProyecto);
export const mapTareas = (arr: TareaApi[]): Tarea[] => arr.map(mapTarea);
export const mapAsistencias = (arr: AsistenciaApi[]): Asistencia[] => arr.map(mapAsistencia);
export const mapCapacitaciones = (arr: CapacitacionApi[]): Capacitacion[] => arr.map(mapCapacitacion);
export const mapCapacitacionesProximas = (arr: CapacitacionProximaApi[]) => arr.map(mapCapacitacionProxima);

// ─── Dashboard Mapper ───

export const mapDashboardStats = (
  resumen: DashboardResumen,
  graficos: DashboardGraficos,
  capacitacionesProximas: CapacitacionProximaApi[],
  misProyectos: Proyecto[] = [],
  misTareas: Tarea[] = [],
  capacitacionesTotal: number = 0
): DashboardStats => {
  const proyectosPorEstado = (graficos.proyectos_por_estado || []).map((item) => ({
    name: item.estado,
    value: item.cantidad,
  }));

  const tareasPorEstado = graficos.tareas_por_estado || [];
  const tareasCompletadas = tareasPorEstado.find((t) => t.estado === 'Completada')?.cantidad ?? 0;
  const proyectosActivos = (graficos.proyectos_por_estado || []).reduce((sum, item) => {
    if (item.estado !== 'Completado' && item.estado !== 'Cancelado') {
      return sum + item.cantidad;
    }
    return sum;
  }, 0);

  const asistenciasHoy = (graficos.asistencias_hoy || []).reduce((sum, item) => sum + item.cantidad, 0);

  const misTareasPendientes = misTareas.filter((t) => t.estado === 'Pendiente' || t.estado === 'En progreso').length;
  const misTareasCompletadas = misTareas.filter((t) => t.estado === 'Completada').length;

  const proyectosRecientes = [...misProyectos].slice(0, 5);

  const actividadReciente = [
    { icon: '📋', color: 'text-blue-600', bg: 'bg-blue-100', title: 'Proyectos totales', sub: `${resumen.total_proyectos} proyectos registrados` },
    { icon: '✅', color: 'text-green-600', bg: 'bg-green-100', title: 'Tareas completadas', sub: `${tareasCompletadas} tareas finalizadas` },
    { icon: '👥', color: 'text-purple-600', bg: 'bg-purple-100', title: 'Clientes', sub: `${resumen.total_clientes} clientes activos` },
  ];

  return {
    proyectosTotales: resumen.total_proyectos,
    proyectosActivos,
    tareasPendientes: resumen.tareas_pendientes,
    tareasCompletadas,
    clientesTotal: resumen.total_clientes,
    trabajadoresTotal: resumen.total_usuarios,
    asistenciasHoy,
    capacitacionesTotal,
    proyectosPorEstado,
    tareasPorMes: [],
    proyectosRecientes,
    actividadReciente,
    misProyectos,
    misTareas,
    misTareasPendientes,
    misTareasCompletadas,
    capacitacionesProximas: mapCapacitacionesProximas(capacitacionesProximas),
  };
};
