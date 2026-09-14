import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsedUser = JSON.parse(user);
      // Aquí se agregaría el token cuando se implemente backend
      // config.headers.Authorization = `Bearer ${parsedUser.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Manejar error de autenticación
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de API (preparados para cuando exista backend)

// Autenticación
export const authService = {
  login: async (email: string, password: string) => {
    // Por ahora no hace llamada real, se maneja en AuthContext
    // return api.post('/auth/login', { email, password });
    return Promise.resolve({ data: { success: true } });
  },
  register: async (userData: any) => {
    // return api.post('/auth/register', userData);
    return Promise.resolve({ data: { success: true } });
  },
  logout: async () => {
    // return api.post('/auth/logout');
    return Promise.resolve({ data: { success: true } });
  },
};

// Usuarios
export const usuariosService = {
  getAll: async () => {
    // return api.get('/usuarios');
    return Promise.resolve({ data: [] });
  },
  getById: async (id: string) => {
    // return api.get(`/usuarios/${id}`);
    return Promise.resolve({ data: {} });
  },
  create: async (userData: any) => {
    // return api.post('/usuarios', userData);
    return Promise.resolve({ data: { success: true } });
  },
  update: async (id: string, userData: any) => {
    // return api.put(`/usuarios/${id}`, userData);
    return Promise.resolve({ data: { success: true } });
  },
  delete: async (id: string) => {
    // return api.delete(`/usuarios/${id}`);
    return Promise.resolve({ data: { success: true } });
  },
};

// Clientes
export const clientesService = {
  getAll: async () => {
    return Promise.resolve({ data: [] });
  },
  getById: async (id: string) => {
    return Promise.resolve({ data: {} });
  },
  create: async (clienteData: any) => {
    return Promise.resolve({ data: { success: true } });
  },
  update: async (id: string, clienteData: any) => {
    return Promise.resolve({ data: { success: true } });
  },
  delete: async (id: string) => {
    return Promise.resolve({ data: { success: true } });
  },
};

// Proyectos
export const proyectosService = {
  getAll: async () => {
    return Promise.resolve({ data: [] });
  },
  getById: async (id: string) => {
    return Promise.resolve({ data: {} });
  },
  create: async (proyectoData: any) => {
    return Promise.resolve({ data: { success: true } });
  },
  update: async (id: string, proyectoData: any) => {
    return Promise.resolve({ data: { success: true } });
  },
  delete: async (id: string) => {
    return Promise.resolve({ data: { success: true } });
  },
};

// Tareas
export const tareasService = {
  getAll: async () => {
    return Promise.resolve({ data: [] });
  },
  getById: async (id: string) => {
    return Promise.resolve({ data: {} });
  },
  create: async (tareaData: any) => {
    return Promise.resolve({ data: { success: true } });
  },
  update: async (id: string, tareaData: any) => {
    return Promise.resolve({ data: { success: true } });
  },
  delete: async (id: string) => {
    return Promise.resolve({ data: { success: true } });
  },
};

export default api;
