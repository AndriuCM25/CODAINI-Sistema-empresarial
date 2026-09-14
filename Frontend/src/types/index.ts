// Roles del sistema
export type RolType = 'Administrador' | 'Trabajador' | 'Usuario';

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

// Usuario base
export interface Usuario {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  telefono: string;
  rol: RolType;
  fotoPerfil?: string;
  iniciales: string;
  estado: 'Activo' | 'Inactivo';
  fechaRegistro: string;
}

// Trabajador (extiende Usuario)
export interface Trabajador extends Usuario {
  cargo: string;
  area: string;
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
  fechaRegistro: string;
}

// Proyecto
export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  clienteId: string;
  cliente: string; // nombre de la empresa
  responsableId: string;
  responsable: string; // nombre del trabajador
  estado: EstadoProyecto;
  progreso: number; // 0-100
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
  duracion: string; // ej: "2 horas"
  participantes: string[]; // IDs de trabajadores
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
  updateUser: (userData: Partial<Usuario>) => void;
  isAuthenticated: boolean;
}

// Datos del formulario de registro
export interface RegistroFormData {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  confirmarPassword: string;
  telefono: string;
  rol: 'Trabajador' | 'Usuario';
  cargo?: string;
  area?: string;
  empresa?: string;
  fotoPerfil?: File | null;
}
