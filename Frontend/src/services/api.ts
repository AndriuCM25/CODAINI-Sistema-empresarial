import axios, { AxiosError } from 'axios';
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
  DashboardStats,
  DashboardDataApi,
  CapacitacionProximaApi,
  LoginResponse,
} from '../types';
import {
  mapUsuario,
  mapUsuarios,
  mapCliente,
  mapClientes,
  mapProyecto,
  mapProyectos,
  mapTarea,
  mapTareas,
  mapAsistencia,
  mapAsistencias,
  mapCapacitacion,
  mapCapacitaciones,
  mapDashboardStats,
  mapClienteRequest,
  mapProyectoRequest,
  mapTareaRequest,
  mapCapacitacionRequest,
} from './adapters';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data && typeof data === 'object' && 'success' in data) {
      return { ...response, data: data.data ?? data };
    }
    return response;
  },
  (error: AxiosError) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<{ token: string; user: UsuarioApi }>('/auth/login', { email, password });
    const { token, user } = response.data;
    return { token, user: mapUsuario(user) };
  },
  register: async (userData: Record<string, unknown>): Promise<unknown> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  },
  getMe: async (): Promise<Usuario> => {
    const response = await api.get<UsuarioApi>('/auth/me');
    return mapUsuario(response.data);
  },
  updateUser: async (userData: Partial<Usuario>): Promise<Usuario> => {
    const response = await api.put<UsuarioApi>('/profile', userData);
    return mapUsuario(response.data);
  },
};

export const usuariosService = {
  getAll: async (): Promise<Usuario[]> => {
    const response = await api.get<UsuarioApi[]>('/usuarios');
    return mapUsuarios(response.data);
  },
  getById: async (id: string): Promise<Usuario> => {
    const response = await api.get<UsuarioApi>(`/usuarios/${id}`);
    return mapUsuario(response.data);
  },
  create: async (userData: Record<string, unknown>): Promise<Usuario> => {
    const response = await api.post<UsuarioApi>('/usuarios', userData);
    return mapUsuario(response.data);
  },
  update: async (id: string, userData: Record<string, unknown>): Promise<Usuario> => {
    const response = await api.put<UsuarioApi>(`/usuarios/${id}`, userData);
    return mapUsuario(response.data);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },
};

export const trabajadoresService = {
  getAll: async (): Promise<Usuario[]> => {
    const response = await api.get<UsuarioApi[]>('/usuarios');
    return mapUsuarios(response.data).filter((u) => u.rol === 'Trabajador');
  },
  getById: async (id: string): Promise<Usuario> => {
    const response = await api.get<UsuarioApi>(`/usuarios/${id}`);
    return mapUsuario(response.data);
  },
};

export const clientesService = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await api.get<ClienteApi[]>('/clientes');
    return mapClientes(response.data);
  },
  getById: async (id: string): Promise<Cliente> => {
    const response = await api.get<ClienteApi>(`/clientes/${id}`);
    return mapCliente(response.data);
  },
  create: async (clienteData: Partial<Cliente>): Promise<Cliente> => {
    const apiData = mapClienteRequest(clienteData);
    const response = await api.post<ClienteApi>('/clientes', apiData);
    return mapCliente(response.data);
  },
  update: async (id: string, clienteData: Partial<Cliente>): Promise<Cliente> => {
    const apiData = mapClienteRequest(clienteData);
    const response = await api.put<ClienteApi>(`/clientes/${id}`, apiData);
    return mapCliente(response.data);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },
};

export const proyectosService = {
  getAll: async (): Promise<Proyecto[]> => {
    const response = await api.get<ProyectoApi[]>('/proyectos');
    return mapProyectos(response.data);
  },
  getById: async (id: string): Promise<Proyecto> => {
    const response = await api.get<ProyectoApi>(`/proyectos/${id}`);
    return mapProyecto(response.data);
  },
  create: async (proyectoData: Partial<Proyecto>): Promise<Proyecto> => {
    const apiData = mapProyectoRequest(proyectoData);
    const response = await api.post<ProyectoApi>('/proyectos', apiData);
    return mapProyecto(response.data);
  },
  update: async (id: string, proyectoData: Partial<Proyecto>): Promise<Proyecto> => {
    const apiData = mapProyectoRequest(proyectoData);
    const response = await api.put<ProyectoApi>(`/proyectos/${id}`, apiData);
    return mapProyecto(response.data);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/proyectos/${id}`);
  },
};

export const tareasService = {
  getAll: async (): Promise<Tarea[]> => {
    const response = await api.get<TareaApi[]>('/tareas');
    return mapTareas(response.data);
  },
  getById: async (id: string): Promise<Tarea> => {
    const response = await api.get<TareaApi>(`/tareas/${id}`);
    return mapTarea(response.data);
  },
  create: async (tareaData: Partial<Tarea>): Promise<Tarea> => {
    const apiData = mapTareaRequest(tareaData);
    const response = await api.post<TareaApi>('/tareas', apiData);
    return mapTarea(response.data);
  },
  update: async (id: string, tareaData: Partial<Tarea>): Promise<Tarea> => {
    const apiData = mapTareaRequest(tareaData);
    const response = await api.put<TareaApi>(`/tareas/${id}`, apiData);
    return mapTarea(response.data);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tareas/${id}`);
  },
};

export const asistenciasService = {
  getAll: async (): Promise<Asistencia[]> => {
    const response = await api.get<AsistenciaApi[]>('/asistencias');
    return mapAsistencias(response.data);
  },
  marcarEntrada: async (): Promise<unknown> => {
    const response = await api.post('/asistencias/entrada');
    return response.data;
  },
  marcarSalida: async (): Promise<unknown> => {
    const response = await api.post('/asistencias/salida');
    return response.data;
  },
};

export const capacitacionesService = {
  getAll: async (): Promise<Capacitacion[]> => {
    const response = await api.get<CapacitacionApi[]>('/capacitaciones');
    return mapCapacitaciones(response.data);
  },
  getById: async (id: string): Promise<Capacitacion> => {
    const response = await api.get<CapacitacionApi>(`/capacitaciones/${id}`);
    return mapCapacitacion(response.data);
  },
  create: async (capacitacionData: Partial<Capacitacion>): Promise<Capacitacion> => {
    const apiData = mapCapacitacionRequest(capacitacionData);
    const response = await api.post<CapacitacionApi>('/capacitaciones', apiData);
    return mapCapacitacion(response.data);
  },
  update: async (id: string, capacitacionData: Partial<Capacitacion>): Promise<Capacitacion> => {
    const apiData = mapCapacitacionRequest(capacitacionData);
    const response = await api.put<CapacitacionApi>(`/capacitaciones/${id}`, apiData);
    return mapCapacitacion(response.data);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/capacitaciones/${id}`);
  },
};

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardDataApi>('/dashboard');
    const data = response.data;

    if (!data?.resumen || !data?.graficos) {
      return {
        proyectosTotales: 0,
        proyectosActivos: 0,
        tareasPendientes: 0,
        tareasCompletadas: 0,
        clientesTotal: 0,
        trabajadoresTotal: 0,
        asistenciasHoy: 0,
        capacitacionesTotal: 0,
        proyectosPorEstado: [],
        tareasPorMes: [],
        proyectosRecientes: [],
        actividadReciente: [],
        misProyectos: [],
        misTareas: [],
        misTareasPendientes: 0,
        misTareasCompletadas: 0,
        capacitacionesProximas: [],
      };
    }

    let misProyectos: Proyecto[] = [];
    let misTareas: Tarea[] = [];
    let capacitacionesTotal = 0;

    try {
      const [proyectosRes, tareasRes, capacitacionesRes] = await Promise.all([
        api.get<ProyectoApi[]>('/proyectos'),
        api.get<TareaApi[]>('/tareas'),
        api.get<CapacitacionApi[]>('/capacitaciones'),
      ]);
      misProyectos = proyectosRes.data.map(mapProyecto);
      misTareas = tareasRes.data.map(mapTarea);
      capacitacionesTotal = capacitacionesRes.data.length;
    } catch {
      // Silently fail if user can't access related endpoints
    }

    return mapDashboardStats(
      data.resumen,
      data.graficos,
      data.proximas_capacitaciones || [],
      misProyectos,
      misTareas,
      capacitacionesTotal
    );
  },
};

export default api;
