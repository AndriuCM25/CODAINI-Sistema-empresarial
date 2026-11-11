// Roles del sistema — alineados con el backend (AuthController)
export type RolType = 'Administrador' | 'Trabajador' | 'Cliente';

// Estados de proyecto
export type EstadoProyecto = 'Pendiente' | 'En progreso' | 'Completado' | 'Cancelado';

// Estados de tarea
export type EstadoTarea = 'Pendiente' | 'En progreso' | 'Completada';

// Prioridades
export type Prioridad = 'Alta' | 'Media' | 'Baja';

// Estados de asistencia
export type EstadoAsistencia = 'Presente' | 'Tardanza' | 'Falta';

// Estados de capacitación
export type EstadoCapacitacion = 'Programada' | 'En curso' | 'Finalizada';

// Usuario base — campos frontend (camelCase)
export interface Usuario {
  id: string;
  nombre: string;
  apellidos?: string;
  email: string;
  password?: string;
  telefono: string;
  rol: RolType;
  fotoPerfil?: string;
  iniciales?: string;
  estado: 'Activo' | 'Inactivo';
  fechaRegistro?: string;
}

// Trabajador (extiende Usuario)
export interface Trabajador extends Usuario {
  cargo?: string;
  area?: string;
}

// Cliente (puede ser empresa o usuario externo)
export interface Cliente {
  id: string;
  empresa: string;
  ruc: string;
  contacto: string;
  email: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo';
  fechaRegistro?: string;
}

// Proyecto
export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  clienteId: string;
  cliente: string;
  responsableId: string;
  responsable: string;
  estado: EstadoProyecto;
  progreso: number;
  fechaInicio: string;
  fechaLimite: string;
  presupuesto?: number;
}

// Tarea
export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  proyectoId: string;
  proyecto: string;
  responsableId: string;
  responsable: string;
  prioridad: Prioridad;
  estado: EstadoTarea;
  fechaCreacion: string;
  fechaLimite: string;
}

// Asistencia
export interface Asistencia {
  id: string;
  trabajadorId: string;
  trabajador: string;
  fecha: string;
  horaEntrada: string;
  horaSalida?: string;
  estado: EstadoAsistencia;
}

// Capacitación
export interface Capacitacion {
  id: string;
  nombre: string;
  descripcion: string;
  instructor: string;
  fecha: string;
  hora: string;
  duracion: string;
  participantes: string[];
  numeroParticipantes: number;
  estado: EstadoCapacitacion;
  ubicacion: string;
}

// Recordatorio
export interface Recordatorio {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  prioridad: Prioridad;
  completado: boolean;
  usuarioId: string;
}

// Notificación
export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  tipo: 'info' | 'success' | 'warning' | 'error';
}

// Context de autenticación
export interface AuthContextType {
  user: Usuario | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<Usuario> & { confirmarPassword: string }) => Promise<boolean>;
  updateUser: (userData: Partial<Usuario>) => Promise<void>;
  isAuthenticated: boolean;
}

// RegistroFormData
export interface RegistroFormData {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  confirmarPassword: string;
  telefono: string;
  rol: 'Trabajador' | 'Cliente';
  cargo?: string;
  area?: string;
  empresa?: string;
  fotoPerfil?: File | null;
}

// Tooltip genérico para Recharts
export interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    color?: string;
    name?: string;
    value?: number | string;
  }>;
  label?: string;
}

// Respuesta de la API de login
export interface LoginResponse {
  token: string;
  user: Usuario;
}

// --- API Response Types (snake_case, from backend) ---

export interface UsuarioApi {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  telefono: string | null;
  estado: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClienteApi {
  id: number;
  nombre_empresa: string;
  ruc: string;
  contacto_nombre: string;
  email: string;
  telefono: string | null;
  estado: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProyectoApi {
  id: number;
  nombre: string;
  descripcion: string;
  cliente_id: number;
  responsable_id: number;
  estado: string;
  fecha_inicio: string;
  fecha_limite: string;
  presupuesto?: number;
  created_at?: string;
  updated_at?: string;
  cliente?: { nombre_empresa: string };
  responsable?: { nombre: string };
}

export interface TareaApi {
  id: number;
  titulo: string;
  descripcion: string;
  proyecto_id: number;
  responsable_id: number;
  prioridad: string;
  estado: string;
  fecha_creacion: string;
  fecha_limite: string;
  proyecto?: { nombre: string };
  responsable?: { nombre: string };
}

export interface AsistenciaApi {
  id: number;
  trabajador_id: number;
  fecha: string;
  hora_entrada: string;
  hora_salida: string | null;
  estado: string;
  trabajador?: { nombre: string };
}

export interface CapacitacionApi {
  id: number;
  nombre: string;
  descripcion: string;
  instructor: string;
  fecha: string;
  hora: string;
  duracion: string;
  participantes_ids?: number[];
  estado: string;
  ubicacion: string;
  numero_participantes?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Dashboard response structure (from DashboardController)
export interface DashboardResumen {
  total_usuarios: number;
  total_clientes: number;
  total_proyectos: number;
  tareas_pendientes: number;
  presupuesto_total: number;
}

export interface GraficoItem {
  name: string;
  value: number;
}

export interface EstadoCount {
  estado: string;
  cantidad: number;
}

export interface DashboardGraficos {
  proyectos_por_estado: EstadoCount[];
  tareas_por_estado: EstadoCount[];
  asistencias_hoy: EstadoCount[];
}

export interface CapacitacionProximaApi {
  id: number;
  tema: string;
  fecha: string;
  hora: string;
  instructor: string;
  estado: string;
}

export interface DashboardDataApi {
  resumen: DashboardResumen;
  graficos: DashboardGraficos;
  proximas_capacitaciones: CapacitacionProximaApi[];
}

// Estadísticas del dashboard (frontend format)
export interface DashboardStats {
  proyectosTotales: number;
  proyectosActivos: number;
  tareasPendientes: number;
  tareasCompletadas: number;
  clientesTotal: number;
  trabajadoresTotal: number;
  asistenciasHoy: number;
  capacitacionesTotal: number;
  proyectosPorEstado: { name: string; value: number }[];
  tareasPorMes: { mes: string; tareas: number }[];
  proyectosRecientes: Proyecto[];
  actividadReciente: ActividadItem[];
  misProyectos: Proyecto[];
  misTareas: Tarea[];
  misTareasPendientes: number;
  misTareasCompletadas: number;
  capacitacionesProximas: CapacitacionProxima[];
}

export interface CapacitacionProxima {
  id: string;
  nombre: string;
  fecha: string;
  instructor: string;
}

export interface ActividadItem {
  icon: string;
  color: string;
  bg: string;
  title: string;
  sub: string;
}

// Formulario de creación/edición de cliente
export type ClienteForm = Omit<Cliente, 'id' | 'fechaRegistro'>;

// Formulario de creación/edición de proyecto
export type ProyectoForm = Omit<Proyecto, 'id' | 'cliente' | 'responsable'>;

// Formulario de creación/edición de tarea
export type TareaForm = Omit<Tarea, 'id' | 'proyecto' | 'responsable'>;

// Formulario de creación/edición de capacitación
export type CapacitacionForm = Omit<Capacitacion, 'id' | 'numeroParticipantes'>;