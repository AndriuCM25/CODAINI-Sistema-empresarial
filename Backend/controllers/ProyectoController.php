<?php

namespace App\Controllers;

use App\Models\Proyecto;
use App\Utils\Response;
use App\Middleware\AuthMiddleware;

class ProyectoController
{
    private Proyecto $proyectoModel;

    public function __construct()
    {
        $this->proyectoModel = new Proyecto();
    }

    /**
     * Listar todos los proyectos
     * GET /api/proyectos
     */
    public function index(): void
    {
        AuthMiddleware::authenticate();
        $proyectos = $this->proyectoModel->getAll();
        Response::success($proyectos);
    }

    /**
     * Obtener proyecto por ID
     * GET /api/proyectos/{id}
     */
    public function show(int $id): void
    {
        AuthMiddleware::authenticate();
        $proyecto = $this->proyectoModel->findById($id);

        if (!$proyecto) {
            Response::notFound('Proyecto no encontrado.');
        }

        Response::success($proyecto);
    }

    /**
     * Crear nuevo proyecto
     * POST /api/proyectos
     */
    public function store(): void
    {
        AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $nombre = trim($input['nombre'] ?? '');
        $clienteId = !empty($input['cliente_id']) ? (int)$input['cliente_id'] : null;
        $fechaInicio = !empty($input['fecha_inicio']) ? $input['fecha_inicio'] : date('Y-m-d');

        // Si no se proporcionó cliente_id pero viene cliente (nombre), buscarlo
        if (empty($clienteId) && !empty($input['cliente'])) {
            $clienteNombre = trim($input['cliente']);
            $db = \App\Config\Database::getConnection();
            $stmt = $db->prepare("SELECT id FROM clientes WHERE nombre_empresa LIKE :nombre LIMIT 1");
            $stmt->execute([':nombre' => "%{$clienteNombre}%"]);
            $c = $stmt->fetch();
            if ($c) {
                $clienteId = (int)$c['id'];
            }
        }

        // Si aún no hay cliente_id, asignar el primer cliente registrado
        if (empty($clienteId)) {
            $primerCliente = \App\Config\Database::getConnection()->query("SELECT id FROM clientes ORDER BY id ASC LIMIT 1")->fetch();
            if ($primerCliente) {
                $clienteId = (int)$primerCliente['id'];
            }
        }

        // Si viene responsable por nombre y no responsable_id
        if (empty($input['responsable_id']) && !empty($input['responsable'])) {
            $respNombre = trim($input['responsable']);
            $db = \App\Config\Database::getConnection();
            $stmt = $db->prepare("SELECT id FROM usuarios WHERE nombre LIKE :nombre LIMIT 1");
            $stmt->execute([':nombre' => "%{$respNombre}%"]);
            $u = $stmt->fetch();
            if ($u) {
                $input['responsable_id'] = (int)$u['id'];
            }
        }

        if (empty($nombre) || empty($clienteId)) {
            Response::error('El nombre del proyecto y el cliente son requeridos.', 422);
        }

        $input['cliente_id'] = $clienteId;
        $input['fecha_inicio'] = $fechaInicio;
        if (!isset($input['fecha_fin_estimada']) && isset($input['fecha_limite'])) {
            $input['fecha_fin_estimada'] = $input['fecha_limite'];
        }

        $id = $this->proyectoModel->create($input);
        $proyecto = $this->proyectoModel->findById($id);

        Response::success($proyecto, 'Proyecto creado exitosamente', 201);
    }

    /**
     * Actualizar proyecto
     * PUT /api/proyectos/{id}
     */
    public function update(int $id): void
    {
        AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $proyecto = $this->proyectoModel->findById($id);
        if (!$proyecto) {
            Response::notFound('Proyecto no encontrado.');
        }

        $this->proyectoModel->update($id, $input);
        $actualizado = $this->proyectoModel->findById($id);

        Response::success($actualizado, 'Proyecto modificado con éxito');
    }

    /**
     * Eliminar proyecto
     * DELETE /api/proyectos/{id}
     */
    public function delete(int $id): void
    {
        AuthMiddleware::authorize(['Administrador']);
        $proyecto = $this->proyectoModel->findById($id);

        if (!$proyecto) {
            Response::notFound('Proyecto no encontrado.');
        }

        $this->proyectoModel->delete($id);
        Response::success(null, 'Proyecto eliminado correctamente');
    }
}
