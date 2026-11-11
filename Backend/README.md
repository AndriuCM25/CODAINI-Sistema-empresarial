# CODAINI - Backend API RESTful (PHP & MySQL)

API RESTful desarrollada en PHP para el sistema empresarial de CODAINI, conectada a MySQL mediante PDO y asegurada con autenticación JWT (JSON Web Tokens). Diseñada para integrarse de forma fluida con el frontend en React + Vite + Axios.

---

## 📁 Estructura del Backend

```
Backend/
├── config/
│   ├── database.php        # Conexión PDO Singleton a MySQL con UTF8mb4
│   ├── cors.php            # Lista blanca de orígenes y cabeceras permitidas
│   └── jwt.php             # Parámetros y secret key de JWT
├── controllers/
│   ├── AuthController.php          # Login, registro, perfil actual y logout
│   ├── UsuarioController.php       # Gestión de usuarios del sistema
│   ├── ClienteController.php       # Gestión de clientes y cartera
│   ├── ProyectoController.php      # Proyectos y asignaciones
│   ├── TareaController.php         # Tareas y seguimiento Kanban/lista
│   ├── AsistenciaController.php    # Registro de entradas, salidas y puntualidad
│   ├── CapacitacionController.php  # Cursos internos y asistencia
│   └── DashboardController.php     # Métricas y KPIs consolidados para Recharts
├── middleware/
│   ├── CorsMiddleware.php  # Encabezados CORS y manejo de preflight OPTIONS
│   └── AuthMiddleware.php  # Verificación de Bearer JWT y control de roles
├── models/
│   ├── Usuario.php
│   ├── Cliente.php
│   ├── Proyecto.php
│   ├── Tarea.php
│   ├── Asistencia.php
│   └── Capacitacion.php
├── routes/
│   └── api.php             # Enrutador REST con soporte para rutas dinámicas
├── services_python/        # Microservicio complementario en FastAPI / Python
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
├── utils/
│   ├── JWT.php             # Generación/validación JWT con compatibilidad nativa y Firebase
│   └── Response.php        # Helper estandarizado para respuestas JSON
├── database/
│   └── schema.sql          # Tablas relacionales e inserción de datos semilla
├── .env.example            # Plantilla de variables de entorno
├── .env                    # Configuración de entorno local
├── composer.json           # Dependencias PHP (php-jwt, phpdotenv)
└── index.php               # Front Controller principal
```

---

## 🚀 Puesta en Marcha

### 1. Base de Datos MySQL
1. Inicia tu servidor MySQL (por ejemplo mediante XAMPP, Laragon, MySQL Server o Docker).
2. Importa el archivo `Backend/database/schema.sql` en tu gestor (phpMyAdmin, DBeaver, HeidiSQL o CLI):
   ```bash
   mysql -u root -p < Backend/database/schema.sql
   ```
   *Esto creará la base de datos `codaini_db` con todas las tablas relacionales y registros iniciales.*

### 2. Configurar Variables de Entorno
Asegúrate de que el archivo `Backend/.env` tenga tus credenciales correctas:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=codaini_db
DB_USER=root
DB_PASS=
JWT_SECRET=codaini_jwt_secure_super_secret_key_2025_default_dev
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

### 3. Dependencias de Composer (Opcional)
La arquitectura cuenta con autoloader nativo y generación JWT RFC 7519 incorporada, por lo que puede arrancar de inmediato. No obstante, puedes instalar las librerías oficiales de Composer:
```bash
cd Backend
composer install
```

### 4. Iniciar el Servidor de Desarrollo
Ejecuta el servidor embebido de PHP apuntando al directorio `Backend`:
```bash
php -S 127.0.0.1:8000 -t Backend Backend/index.php
```
O si estás dentro de la carpeta `Backend`:
```bash
php -S 127.0.0.1:8000 index.php
```

---

## 🔑 Credenciales de Acceso Semilla

Todos los usuarios de prueba tienen la contraseña: **`Admin123*`**

| Rol | Correo Electrónico | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@codaini.com` | `Admin123*` |
| **Trabajador** | `juan.perez@codaini.com` | `Admin123*` |
| **Trabajador** | `maria.gomez@codaini.com` | `Admin123*` |
| **Cliente** | `carlos.cliente@empresa.com` | `Admin123*` |

---

## 📡 Endpoints de la API REST

### 1. Autenticación (`/api/auth`)
- `POST /api/auth/login` → Iniciar sesión (retorna token JWT y datos de usuario).
- `POST /api/auth/register` → Registrar nuevo usuario.
- `GET /api/auth/me` → Obtener información del usuario autenticado (requiere `Authorization: Bearer <token>`).
- `POST /api/auth/logout` → Cerrar sesión.

### 2. Usuarios (`/api/usuarios`)
- `GET /api/usuarios` → Listar todos los usuarios.
- `GET /api/usuarios/{id}` → Ver detalle de un usuario.
- `POST /api/usuarios` → Crear nuevo usuario (Administrador).
- `PUT /api/usuarios/{id}` → Actualizar datos de usuario.
- `DELETE /api/usuarios/{id}` → Eliminar usuario (Administrador).

### 3. Clientes (`/api/clientes`)
- `GET /api/clientes` → Listar empresas cliente.
- `GET /api/clientes/{id}` → Detalle del cliente.
- `POST /api/clientes` → Registrar cliente con RUC y datos de contacto.
- `PUT /api/clientes/{id}` → Editar cliente.
- `DELETE /api/clientes/{id}` → Eliminar cliente.

### 4. Proyectos (`/api/proyectos`)
- `GET /api/proyectos` → Listar proyectos con cliente y responsable asociados.
- `GET /api/proyectos/{id}` → Detalle del proyecto.
- `POST /api/proyectos` → Crear proyecto con presupuesto y fechas.
- `PUT /api/proyectos/{id}` → Actualizar estado o presupuesto.
- `DELETE /api/proyectos/{id}` → Eliminar proyecto.

### 5. Tareas (`/api/tareas`)
- `GET /api/tareas` → Listar todas las tareas (soporta `?proyecto_id=1`).
- `GET /api/tareas/{id}` → Detalle de la tarea.
- `POST /api/tareas` → Crear tarea asignada a un usuario.
- `PUT /api/tareas/{id}` → Actualizar estado (`Pendiente`, `En progreso`, `Completada`).
- `DELETE /api/tareas/{id}` → Eliminar tarea.

### 6. Control de Asistencia (`/api/asistencias`)
- `GET /api/asistencias` → Listar asistencias (soporta `?fecha=YYYY-MM-DD`).
- `POST /api/asistencias/entrada` → Marcar hora de ingreso del día.
- `POST /api/asistencias/salida` → Marcar hora de salida del día.
- `GET /api/asistencias/mi-historial` → Historial de asistencias del usuario logueado.

### 7. Capacitaciones (`/api/capacitaciones`)
- `GET /api/capacitaciones` → Listar capacitaciones y programas formativos.
- `GET /api/capacitaciones/{id}` → Detalle de la capacitación con participantes.
- `POST /api/capacitaciones` → Programar nueva capacitación.
- `PUT /api/capacitaciones/{id}` → Actualizar tema, instructor o estado.
- `DELETE /api/capacitaciones/{id}` → Eliminar capacitación.
- `GET /api/capacitaciones/{id}/participantes` → Listar colaboradores inscritos.
- `POST /api/capacitaciones/{id}/participantes` → Inscribir participante.

### 8. Dashboard y Reportes (`/api/dashboard`)
- `GET /api/dashboard` → Métricas consolidadas (proyectos por estado, tareas, presupuesto, asistencia de hoy) listas para alimentar Recharts en el Frontend.
