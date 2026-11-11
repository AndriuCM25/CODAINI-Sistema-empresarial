-- =====================================================================
-- CODAINI - Sistema Empresarial
-- Script de Base de Datos Relacional (schema.sql)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS codaini_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE codaini_db;

-- Desactivar temporalmente revisión de claves foráneas para recreación segura
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS capacitacion_participantes;
DROP TABLE IF EXISTS capacitaciones;
DROP TABLE IF EXISTS asistencias;
DROP TABLE IF EXISTS tareas;
DROP TABLE IF EXISTS proyectos;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. TABLA: usuarios
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('Administrador', 'Trabajador', 'Cliente') NOT NULL DEFAULT 'Trabajador',
    telefono VARCHAR(30) NULL,
    estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usuarios_email (email),
    INDEX idx_usuarios_rol (rol),
    INDEX idx_usuarios_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. TABLA: clientes
-- ---------------------------------------------------------------------
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_empresa VARCHAR(150) NOT NULL,
    ruc VARCHAR(20) NOT NULL UNIQUE,
    contacto_nombre VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(30) NULL,
    estado ENUM('Activo', 'Inactivo') NOT NULL DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_clientes_ruc (ruc),
    INDEX idx_clientes_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. TABLA: proyectos
-- ---------------------------------------------------------------------
CREATE TABLE proyectos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(180) NOT NULL,
    descripcion TEXT NULL,
    cliente_id INT NOT NULL,
    responsable_id INT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin_estimada DATE NULL,
    presupuesto DECIMAL(12, 2) DEFAULT 0.00,
    estado ENUM('Pendiente', 'En Progreso', 'Completado', 'Cancelado') NOT NULL DEFAULT 'Pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_proyectos_cliente FOREIGN KEY (cliente_id) 
        REFERENCES clientes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_proyectos_responsable FOREIGN KEY (responsable_id) 
        REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_proyectos_estado (estado),
    INDEX idx_proyectos_cliente (cliente_id),
    INDEX idx_proyectos_responsable (responsable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. TABLA: tareas
-- ---------------------------------------------------------------------
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT NOT NULL,
    titulo VARCHAR(180) NOT NULL,
    descripcion TEXT NULL,
    asignado_a INT NULL,
    prioridad ENUM('Baja', 'Media', 'Alta') NOT NULL DEFAULT 'Media',
    estado ENUM('Pendiente', 'En progreso', 'Completada') NOT NULL DEFAULT 'Pendiente',
    fecha_vencimiento DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tareas_proyecto FOREIGN KEY (proyecto_id) 
        REFERENCES proyectos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tareas_asignado FOREIGN KEY (asignado_a) 
        REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_tareas_proyecto (proyecto_id),
    INDEX idx_tareas_asignado (asignado_a),
    INDEX idx_tareas_estado (estado),
    INDEX idx_tareas_prioridad (prioridad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. TABLA: asistencias
-- ---------------------------------------------------------------------
CREATE TABLE asistencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_entrada TIME NULL,
    hora_salida TIME NULL,
    estado ENUM('Presente', 'Tarde', 'Ausente') NOT NULL DEFAULT 'Presente',
    observaciones VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asistencias_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uk_asistencia_usuario_fecha (usuario_id, fecha),
    INDEX idx_asistencias_fecha (fecha),
    INDEX idx_asistencias_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. TABLA: capacitaciones
-- ---------------------------------------------------------------------
CREATE TABLE capacitaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tema VARCHAR(200) NOT NULL,
    instructor VARCHAR(150) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado ENUM('Programada', 'En curso', 'Completada', 'Cancelada') NOT NULL DEFAULT 'Programada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_capacitaciones_fecha (fecha),
    INDEX idx_capacitaciones_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. TABLA: capacitacion_participantes
-- ---------------------------------------------------------------------
CREATE TABLE capacitacion_participantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    capacitacion_id INT NOT NULL,
    usuario_id INT NOT NULL,
    asistencia_estado ENUM('Pendiente', 'Asistió', 'Ausente', 'Justificado') NOT NULL DEFAULT 'Pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cap_part_capacitacion FOREIGN KEY (capacitacion_id) 
        REFERENCES capacitaciones(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cap_part_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uk_participante_capacitacion (capacitacion_id, usuario_id),
    INDEX idx_part_asistencia (asistencia_estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- DATOS SEMILLA (SEED DATA)
-- Contraseña para todos los usuarios de prueba: "Admin123*"
-- Hash Bcrypt generado: $2y$10$yXZYK5MQaWid3kd4ym4f.e.mLl.cROGYUEfmOiR8hxQNb.QXZY.6a
-- (Compatible con password_verify('Admin123*', hash))
-- =====================================================================

INSERT INTO usuarios (id, nombre, email, password_hash, rol, telefono, estado) VALUES
(1, 'Administrador CODAINI', 'admin@codaini.com', '$2y$10$yXZYK5MQaWid3kd4ym4f.e.mLl.cROGYUEfmOiR8hxQNb.QXZY.6a', 'Administrador', '+51 987654321', 'Activo'),
(2, 'Juan Pérez (Desarrollador)', 'juan.perez@codaini.com', '$2y$10$yXZYK5MQaWid3kd4ym4f.e.mLl.cROGYUEfmOiR8hxQNb.QXZY.6a', 'Trabajador', '+51 912345678', 'Activo'),
(3, 'María Gómez (Diseñadora)', 'maria.gomez@codaini.com', '$2y$10$yXZYK5MQaWid3kd4ym4f.e.mLl.cROGYUEfmOiR8hxQNb.QXZY.6a', 'Trabajador', '+51 923456789', 'Activo'),
(4, 'Carlos Rodríguez (Cliente)', 'carlos.cliente@empresa.com', '$2y$10$yXZYK5MQaWid3kd4ym4f.e.mLl.cROGYUEfmOiR8hxQNb.QXZY.6a', 'Cliente', '+51 934567890', 'Activo');

INSERT INTO clientes (id, nombre_empresa, ruc, contacto_nombre, email, telefono, estado) VALUES
(1, 'Innovatech Solutions S.A.C.', '20601234567', 'Carlos Rodríguez', 'contacto@innovatech.pe', '+51 934567890', 'Activo'),
(2, 'Distribuidora del Norte E.I.R.L.', '20509876543', 'Ana Martínez', 'ventas@distnorte.com', '+51 945678901', 'Activo'),
(3, 'Servicios Globales Perú S.A.', '20401122334', 'Roberto Silva', 'gerencia@serviciosglobales.pe', '+51 956789012', 'Activo');

INSERT INTO proyectos (id, nombre, descripcion, cliente_id, responsable_id, fecha_inicio, fecha_fin_estimada, presupuesto, estado) VALUES
(1, 'Sistema ERP y Facturación Electrónica', 'Desarrollo de plataforma cloud empresarial para facturación SUNAT y control de stock.', 1, 2, '2025-01-15', '2025-06-30', 25000.00, 'En Progreso'),
(2, 'Portal Web E-commerce B2B', 'Tienda virtual con pasarela de pagos y sincronización con almacén.', 2, 3, '2025-02-01', '2025-05-15', 14500.00, 'Pendiente'),
(3, 'App Móvil de Gestión de Pedidos', 'Aplicación móvil en React Native para repartidores y supervisores.', 1, 2, '2024-10-01', '2025-01-10', 18000.00, 'Completado');

INSERT INTO tareas (id, proyecto_id, titulo, descripcion, asignado_a, prioridad, estado, fecha_vencimiento) VALUES
(1, 1, 'Diseño del esquema de base de datos MySQL', 'Creación de tablas relacionales y normalización para el ERP.', 2, 'Alta', 'Completada', '2025-01-20'),
(2, 1, 'Implementación de autenticación JWT', 'Endpoints de login y protección de rutas en PHP REST API.', 2, 'Alta', 'En progreso', '2025-02-15'),
(3, 1, 'Maquetación del Dashboard en React', 'Componentes visuales con Tailwind CSS y Recharts.', 3, 'Media', 'Pendiente', '2025-02-28'),
(4, 2, 'Diseño UI/UX de catálogo y checkout', 'Prototipos en Figma y exportación de tokens de diseño.', 3, 'Media', 'Pendiente', '2025-03-10');

INSERT INTO asistencias (usuario_id, fecha, hora_entrada, hora_salida, estado, observaciones) VALUES
(2, CURRENT_DATE(), '08:58:00', NULL, 'Presente', 'Ingreso puntual a guardia matutina'),
(3, CURRENT_DATE(), '09:12:00', NULL, 'Tarde', 'Retraso de 12 minutos por tráfico vehicular');

INSERT INTO capacitaciones (id, tema, instructor, fecha, hora, estado) VALUES
(1, 'Arquitectura Limpia y APIs REST con PHP', 'Ing. Andriu C.', '2025-03-20', '18:00:00', 'Programada'),
(2, 'Optimización y Rendimiento en React 19', 'Ing. Marcos V.', '2025-03-27', '18:30:00', 'Programada');

INSERT INTO capacitacion_participantes (capacitacion_id, usuario_id, asistencia_estado) VALUES
(1, 2, 'Pendiente'),
(1, 3, 'Pendiente');
