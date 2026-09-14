# CODAINI Frontend — Sistema de Gestión Empresarial

> Aplicación web React desarrollada para la gestión interna de CODAINI.  
> Administración de proyectos, trabajadores, clientes, tareas, asistencias, capacitaciones y reportes.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Requisitos Previos](#requisitos-previos)
4. [Instalación y Ejecución](#instalación-y-ejecución)
5. [Estructura de Carpetas](#estructura-de-carpetas)
6. [Sistema de Temas (Dark / Light)](#sistema-de-temas-dark--light)
7. [Sistema de Autenticación](#sistema-de-autenticación)
8. [Roles y Permisos](#roles-y-permisos)
9. [Páginas y Funcionalidades](#páginas-y-funcionalidades)
10. [Componentes Reutilizables](#componentes-reutilizables)
11. [Tipos TypeScript](#tipos-typescript)
12. [Datos Mock](#datos-mock)
13. [Paleta de Colores](#paleta-de-colores)
14. [Escalabilidad Backend](#escalabilidad-backend)
15. [Credenciales de Prueba](#credenciales-de-prueba)

---

## Descripción General

CODAINI Frontend es una SPA (Single Page Application) construida con **React 18 + TypeScript**, diseñada para gestionar todas las operaciones internas de la empresa CODAINI. La interfaz es profesional, moderna y adaptable a distintos roles de usuario.

**Características principales:**

- ✅ Sistema de autenticación con roles (Admin, Trabajador, Cliente)
- ✅ Dashboard diferenciado por rol
- ✅ Tema oscuro / claro con persistencia en `localStorage`
- ✅ Diseño responsive (mobile-first)
- ✅ Animaciones fluidas con Framer Motion
- ✅ Alertas interactivas con SweetAlert2 (adaptadas al tema)
- ✅ Gráficos adaptativos con Recharts
- ✅ Arquitectura escalable para integración con backend PHP + Supabase

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **React** | 18.3.x | Librería de UI principal |
| **TypeScript** | 5.4.x | Tipado estático |
| **Vite** | 5.2.x | Bundler y servidor de desarrollo |
| **Tailwind CSS** | 3.4.x | Estilos utility-first + dark mode |
| **React Router** | 6.22.x | Navegación y rutas protegidas |
| **Framer Motion** | 11.x | Animaciones y transiciones |
| **Lucide React** | 0.363.x | Iconografía consistente |
| **Recharts** | 2.12.x | Gráficos de barras, líneas y torta |
| **SweetAlert2** | 11.x | Modales y alertas interactivas |
| **Axios** | 1.6.x | Cliente HTTP (preparado para backend) |

---

## Requisitos Previos

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (o pnpm / yarn)

---

## Instalación y Ejecución

```bash
# 1. Entrar a la carpeta del frontend
cd Frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

### Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo con HMR
npm run build     # Compilar para producción (tsc + vite build)
npm run preview   # Previsualizar el build de producción
npm run lint      # Linter con ESLint + TypeScript
```

---

## Estructura de Carpetas

```
Frontend/
├── public/                        # Archivos estáticos servidos directamente
│   ├── logo_codaini.png           # Logo para modo claro
│   └── logo_codaini(darkMODE).png # Logo para modo oscuro (líneas blancas)
│
├── src/
│   ├── main.tsx                   # Punto de entrada de la aplicación
│   ├── App.tsx                    # Componente raíz + layout + providers
│   ├── index.css                  # Estilos globales, variables CSS, animaciones
│   │
│   ├── context/                   # Contextos globales de React
│   │   ├── AuthContext.tsx        # Estado de sesión, login, logout, registro
│   │   └── ThemeContext.tsx       # Estado del tema dark/light + toggle
│   │
│   ├── routes/                    # Configuración de rutas
│   │   ├── AppRoutes.tsx          # Definición centralizada de todas las rutas
│   │   └── ProtectedRoute.tsx     # HOC para rutas que requieren autenticación
│   │
│   ├── pages/                     # Páginas de la aplicación (una por vista)
│   │   ├── Login.tsx              # Inicio de sesión
│   │   ├── Register.tsx           # Registro de nuevos usuarios
│   │   ├── Dashboard.tsx          # Panel principal (diferenciado por rol)
│   │   ├── Clientes.tsx           # Gestión de clientes (CRUD completo)
│   │   ├── Proyectos.tsx          # Gestión de proyectos con progreso
│   │   ├── Tareas.tsx             # Gestión de tareas con prioridades
│   │   ├── Trabajadores.tsx       # Equipo de CODAINI (tarjetas)
│   │   ├── Usuarios.tsx           # Usuarios del sistema (tabla)
│   │   ├── Asistencias.tsx        # Control de asistencia diaria
│   │   ├── Capacitaciones.tsx     # Programas de capacitación
│   │   ├── Recordatorios.tsx      # Recordatorios con prioridades
│   │   ├── Reportes.tsx           # Reportes + gráfico de estadísticas
│   │   ├── Perfil.tsx             # Perfil editable del usuario autenticado
│   │   └── Configuracion.tsx      # Ajustes del sistema + selector de tema
│   │
│   ├── components/                # Componentes reutilizables
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Barra superior: toggle tema, notificaciones, usuario
│   │   │   ├── Sidebar.tsx        # Menú lateral con navegación por rol
│   │   │   └── MainLayout.tsx     # Layout base (sidebar + navbar + contenido)
│   │   │
│   │   ├── ui/                    # Componentes de interfaz genéricos
│   │   │   ├── Button.tsx         # Botón con variantes: primary, secondary, danger, ghost
│   │   │   ├── Badge.tsx          # Etiqueta de estado con colores semánticos
│   │   │   ├── Modal.tsx          # Modal accesible con AnimatePresence + Escape key
│   │   │   ├── SearchBar.tsx      # Buscador con botón de limpiar
│   │   │   ├── Avatar.tsx         # Avatar con foto o iniciales automáticas
│   │   │   ├── Loading.tsx        # Spinner de carga (sm/md/lg, fullPage)
│   │   │   ├── EmptyState.tsx     # Estado vacío con ícono y descripción
│   │   │   ├── StatCard.tsx       # Tarjeta de estadística simple
│   │   │   └── ProtectedRoute.tsx # Componente de ruta protegida
│   │   │
│   │   ├── dashboard/
│   │   │   └── StatCard.tsx       # Tarjeta estadística avanzada (trend, color, ícono)
│   │   │
│   │   └── tables/
│   │       └── DataTable.tsx      # Tabla genérica animada con tipado TypeScript
│   │
│   ├── utils/                     # Utilidades y helpers
│   │   ├── themeClasses.ts        # Tokens de clase Tailwind para dark/light mode
│   │   └── swalTheme.ts           # Configuración de SweetAlert2 adaptada al tema
│   │
│   ├── data/
│   │   └── mockData.ts            # Datos de prueba para todas las entidades
│   │
│   ├── services/
│   │   └── api.ts                 # Cliente Axios configurado (listo para backend)
│   │
│   └── types/
│       └── index.ts               # Interfaces y tipos TypeScript globales
│
├── index.html                     # HTML raíz con meta tags
├── vite.config.ts                 # Configuración de Vite
├── tailwind.config.js             # Paleta de colores + dark mode + tokens
├── tsconfig.json                  # Configuración TypeScript principal
├── tsconfig.node.json             # Configuración TypeScript para Vite
└── package.json                   # Dependencias y scripts
```

---

## Sistema de Temas (Dark / Light)

### Cómo funciona

El tema está implementado con **Tailwind `darkMode: 'class'`**. La clase `dark` se aplica al elemento `<html>` según la preferencia del usuario.

```
ThemeProvider (ThemeContext.tsx)
  └─ aplica clase "dark" o "light" en document.documentElement
       └─ Tailwind detecta la clase y aplica los estilos dark: correspondientes
```

### Características

| Feature | Descripción |
|---------|-------------|
| **Dark por defecto** | Si no hay preferencia guardada, arranca en modo oscuro |
| **Persistencia** | Se guarda en `localStorage` con la clave `codaini-theme` |
| **Anti-flash** | Se aplica síncronamente en la inicialización del state para evitar parpadeo |
| **Logo dinámico** | En dark usa `logo_codaini(darkMODE).png`, en light `logo_codaini.png` |
| **SweetAlert2** | Las alertas adaptan colores automáticamente vía `getSwalConfig(isDark)` |
| **Recharts** | Los colores de ejes, grillas y barras cambian con `getChartColors(isDark)` |

### Toggle disponible en

- **Navbar** — botón Moon/Sun animado (siempre visible)
- **Login / Register** — botón discreto en la esquina superior derecha
- **Configuración** — selector visual con tarjetas (Dark / Claro / Sistema)

### Hook de uso

```tsx
import { useTheme } from '../context/ThemeContext';

const { theme, isDark, toggleTheme, setTheme } = useTheme();
```

### Utilidad de clases `tc`

```tsx
import { tc } from '../utils/themeClasses';

// Uso en JSX — cambia automáticamente según el tema
<div className={tc.card}>          // bg-white dark:bg-navy-light
<h1 className={tc.textHeading}>    // text-navy dark:text-highlight
<p  className={tc.textMuted}>      // text-slate dark:text-muted
<input className={tc.input}>       // input completo con focus ring
```

### Variables CSS para Spline / 3D (futuro)

Las variables CSS en `:root` permiten acceder a los colores del tema desde JavaScript o desde componentes canvas que no soportan clases Tailwind:

```js
const bg    = getComputedStyle(document.documentElement).getPropertyValue('--codaini-bg');
const cyan  = getComputedStyle(document.documentElement).getPropertyValue('--codaini-cyan');
```

---

## Sistema de Autenticación

La autenticación es **simulada en el frontend** (sin backend aún). Funciona con `localStorage`.

### Flujo de login

```
Usuario ingresa email + password
  └─ AuthContext.login()
       ├─ Busca en mockUsuarios (usuarios predefinidos)
       └─ Busca en localStorage["registeredUsers"] (usuarios registrados)
            └─ Si coincide → guarda en localStorage["currentUser"] → redirige a /dashboard
```

### Flujo de registro

```
Usuario completa el formulario
  └─ AuthContext.register()
       ├─ Valida que el email no exista
       ├─ Crea el objeto Usuario con iniciales automáticas
       └─ Guarda en localStorage["registeredUsers"]
```

### Rutas protegidas

Todas las rutas excepto `/login` y `/register` están envueltas en `<ProtectedRoute>`.  
Si el usuario no está autenticado, es redirigido automáticamente a `/login`.

```tsx
// Ejemplo de ruta protegida en AppRoutes.tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

## Roles y Permisos

El sistema tiene 3 roles que determinan qué rutas ve en el sidebar y qué contenido muestra el dashboard.

| Rol | Acceso | Dashboard |
|-----|--------|-----------|
| **Administrador** | Todas las páginas | Estadísticas globales, todos los proyectos, actividad reciente, 8 StatCards |
| **Trabajador** | Dashboard, Proyectos, Tareas, Asistencias, Capacitaciones, Recordatorios, Perfil, Configuración | Solo sus proyectos y tareas asignadas |
| **Usuario/Cliente** | Dashboard, Perfil, Configuración | Estado de sus proyectos con barra de progreso |

---

## Páginas y Funcionalidades

### 🔐 Login (`/login`)
- Formulario con email y contraseña
- Toggle de visibilidad de contraseña
- Checkbox "Recordarme"
- Bloque de credenciales de prueba visibles
- Toggle de tema (Moon/Sun) en esquina
- SweetAlert2 para errores y éxito

### 📝 Register (`/register`)
- Selector de tipo de cuenta: **Trabajador** o **Usuario/Cliente**
- Campos dinámicos según el rol seleccionado
- Validaciones completas (email, contraseñas, campos obligatorios)
- Upload de foto de perfil (opcional)
- SweetAlert2 para cada error de validación

### 📊 Dashboard (`/dashboard`)
- **Admin**: 8 StatCards + gráfico de torta (proyectos por estado) + gráfico de líneas (tareas por mes) + tabla de proyectos recientes + feed de actividad
- **Trabajador**: 4 StatCards + lista de tareas pendientes con prioridad
- **Cliente**: 3 StatCards + listado de sus proyectos con progreso

### 👥 Clientes (`/clientes`) — Solo Admin
- Tabla con búsqueda en tiempo real (empresa, contacto, email, RUC)
- CRUD completo: Crear, Editar y Eliminar con formularios en SweetAlert2
- Badges de estado (Activo / Inactivo)

### 📁 Proyectos (`/proyectos`)
- Grid de tarjetas con estado, responsable, cliente
- Barra de progreso por proyecto
- Filtro por nombre y cliente
- Badge de estado con indicador de color

### ✅ Tareas (`/tareas`)
- Tabla con columnas de prioridad y estado
- Badges con indicador de punto de color
- Búsqueda por título o proyecto

### 👷 Trabajadores (`/trabajadores`) — Admin
- Grid de tarjetas con avatar, cargo, área y datos de contacto

### 👤 Usuarios (`/usuarios`) — Admin
- Tabla con avatar, rol (badge), estado y fecha de registro

### 🕐 Asistencias (`/asistencias`)
- Tabla de control de asistencia diaria
- Estado: Presente, Tardanza, Falta

### 📚 Capacitaciones (`/capacitaciones`)
- Grid de cards con instructor, fecha, hora, duración, participantes y ubicación

### 🔔 Recordatorios (`/recordatorios`)
- Grid de cards con borde lateral de color por prioridad (rojo / amarillo / azul)
- Estado "Completado" con tachado visual

### 📈 Reportes (`/reportes`) — Admin
- 4 botones de descarga por tipo (Proyectos, Tareas, Asistencias, Clientes)
- Gráfico de barras mensual (Proyectos vs Tareas) con Recharts adaptativo al tema

### 👤 Perfil (`/perfil`)
- Vista de datos del usuario autenticado
- Modo edición: nombre, apellidos y teléfono editables inline
- Guardado con SweetAlert2 de confirmación

### ⚙️ Configuración (`/configuracion`)
- Selector visual de tema: **Modo Oscuro** / **Modo Claro** / Sistema (próximamente)
- Indicador del tema activo y su persistencia
- Cards de acceso a configuraciones futuras

---

## Componentes Reutilizables

### `<Button>` — variantes disponibles

```tsx
<Button variant="primary">Guardar</Button>      // Teal/Cyan según tema
<Button variant="secondary">Cancelar</Button>   // Borde con acento
<Button variant="danger">Eliminar</Button>       // Rojo
<Button variant="success">Confirmar</Button>     // Verde
<Button variant="ghost">Ver más</Button>         // Solo texto
<Button icon={<Plus />} size="lg">Nuevo</Button> // Con ícono y tamaño
```

### `<Badge>` — variantes de estado

```tsx
<Badge variant="success" dot>Activo</Badge>
<Badge variant="warning">Pendiente</Badge>
<Badge variant="danger">Cancelado</Badge>
<Badge variant="info">En progreso</Badge>
<Badge variant="primary">Principal</Badge>
```

### `<Modal>` — accesible

```tsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Título" subtitle="Opcional" size="md">
  {/* contenido */}
</Modal>
// size: 'sm' | 'md' | 'lg' | 'xl'
// Se cierra con Escape, click en backdrop, o botón X
```

### `<DataTable>` — tabla genérica tipada

```tsx
const columns = [
  { header: 'Nombre', accessor: 'nombre' as keyof MiTipo },
  { header: 'Estado', accessor: (row) => <Badge>{row.estado}</Badge> },
];
<DataTable columns={columns} data={miArray} onRowClick={(row) => console.log(row)} />
```

### `<StatCard>` — dashboard

```tsx
<StatCard
  title="Total Proyectos"
  value={42}
  icon={Briefcase}
  color="primary"           // 'primary' | 'success' | 'warning' | 'danger' | 'info'
  trend={{ value: 12, isPositive: true }}
  delay={0.1}
/>
```

---

## Tipos TypeScript

Todos los tipos globales están en `src/types/index.ts`:

| Tipo / Interface | Descripción |
|-----------------|-------------|
| `RolType` | `'Administrador' \| 'Trabajador' \| 'Usuario'` |
| `EstadoProyecto` | `'Pendiente' \| 'En progreso' \| 'Completado' \| 'Cancelado'` |
| `EstadoTarea` | `'Pendiente' \| 'En progreso' \| 'Completada'` |
| `Prioridad` | `'Alta' \| 'Media' \| 'Baja'` |
| `Usuario` | id, nombre, apellidos, email, password, rol, iniciales, estado, fechaRegistro |
| `Trabajador` | Extiende `Usuario` + cargo + area |
| `Cliente` | empresa, RUC, contacto, email, estado |
| `Proyecto` | nombre, cliente, responsable, estado, progreso (0-100), fechaLimite |
| `Tarea` | titulo, proyecto, responsable, prioridad, estado, fechaLimite |
| `Asistencia` | trabajador, fecha, horaEntrada, horaSalida, estado |
| `Capacitacion` | nombre, instructor, fecha, hora, duracion, participantes |
| `Recordatorio` | titulo, fecha, hora, prioridad, completado |
| `Notificacion` | titulo, mensaje, tipo, leida |
| `AuthContextType` | login, logout, register, updateUser, isAuthenticated |

---

## Datos Mock

Los datos de prueba están en `src/data/mockData.ts`. Incluyen:

- **5 usuarios** (admin, trabajadores, clientes)
- **6 proyectos** con distintos estados y progreso
- **8 tareas** con prioridades y responsables asignados
- **5 clientes** empresariales con RUC
- **4 trabajadores** del equipo CODAINI
- **10 registros de asistencia**
- **3 capacitaciones** en distintos estados
- **4 recordatorios** con prioridades variadas
- **4 notificaciones** (leídas / no leídas)

> Todos estos datos serán reemplazados por llamadas a la API REST del backend cuando se integre.

---

## Paleta de Colores

### Modo Oscuro (dark)

| Token | Color | Uso |
|-------|-------|-----|
| `codaini-navy` | `#0A192F` | Fondo principal |
| `codaini-navy-light` | `#112240` | Cards y paneles |
| `codaini-navy-lighter` | `#172A46` | Inputs y hover |
| `codaini-cyan` | `#64FFDA` | Acento principal |
| `codaini-text` | `#CCD6F6` | Texto principal |
| `codaini-muted` | `#8892B0` | Texto secundario |
| `codaini-highlight` | `#E6F1FF` | Headings |
| `codaini-border` | `#233554` | Bordes |

### Modo Claro (light)

| Token | Color | Uso |
|-------|-------|-----|
| `light-bg` | `#F5F7FA` | Fondo principal |
| `light-surface` | `#FFFFFF` | Cards y paneles |
| `light-surface-2` | `#EAF0F6` | Inputs y hover |
| `light-accent` | `#0F766E` | Acento principal |
| `light-text` | `#0A192F` | Texto principal |
| `light-muted` | `#475569` | Texto secundario |
| `light-border` | `#CBD5E1` | Bordes |

---

## Escalabilidad Backend

El proyecto está estructurado para conectarse fácilmente al backend cuando esté listo.

### Qué hay preparado

- **`src/services/api.ts`** — Cliente Axios con `baseURL` desde variable de entorno `VITE_API_URL`
- **`.env.example`** — Variables de entorno de ejemplo
- **`AuthContext.tsx`** — Las funciones `login`, `register` y `updateUser` solo necesitan apuntar a los endpoints reales en lugar de `localStorage`
- **`mockData.ts`** — Cada array puede ser reemplazado por un `useEffect + axios.get()`
- **Variables CSS** — Disponibles para componentes Spline/Three.js que no usan Tailwind

### Variables de entorno (`.env`)

```env
VITE_API_URL=http://localhost:8000/api   # URL del backend PHP
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_aqui
```

### Integración backend planeada

```
PHP 8.x + API REST
PDO + JWT (JSON Web Tokens)
CORS configurado
Supabase (PostgreSQL + Auth + Storage)
```

---

## Credenciales de Prueba

| Rol | Email | Contraseña | Acceso |
|-----|-------|------------|--------|
| **Administrador** | `admin@codaini.com` | `123456` | Todas las páginas |
| **Trabajador** | `carlos@codaini.com` | `123456` | Páginas de trabajador |
| **Cliente** | `ana@empresa.com` | `123456` | Dashboard y perfil |

> **Administrador principal:** Benjamín Infantes Salazar (`admin@codaini.com`)

---

## Notas de Desarrollo

- Los scripts `npm run dev` y `npm run build` deben ejecutarse **desde la carpeta `Frontend/`**
- El tema se almacena en `localStorage["codaini-theme"]` = `"dark"` | `"light"`
- La sesión se almacena en `localStorage["currentUser"]`
- Los usuarios registrados se guardan en `localStorage["registeredUsers"]`
- Al integrar el backend, reemplazar el localStorage de sesión por **JWT + httpOnly cookies** o **Bearer token en headers**

---

*Desarrollado para CODAINI — Sistema de Gestión Empresarial*
