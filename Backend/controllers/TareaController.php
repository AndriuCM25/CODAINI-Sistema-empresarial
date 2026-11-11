<?php

namespace App\Controllers;

use App\Models\Tarea;
use App\Utils\Response;
use App\Middleware\AuthMiddleware;

class TareaController
{
    private Tarea $tareaModel;

    public function __construct()
    {
        $this->tareaModel = new Tarea();
    }

    /**
     * Listar tareas (con filtro opcional por ?proyecto_id=)
     * GET /api/tareas
     */
    public function index(): void
    {
        AuthMiddleware::authenticate();
        $proyectoId = isset($_GET['proyecto_id']) ? (int)$_GET['proyecto_id'] : null;
        $tareas = $this->tareaModel->getAll($proyectoId);
        Response::success($tareas);
    }

    /**
     * Obtener tarea por ID
     * GET /api/tareas/{id}
     */
    public function show(int $id): void
    {
        AuthMiddleware::authenticate();
        $tarea = $this->tareaModel->findById($id);

        if (!$tarea) {
            Response::notFound('Tarea no encontrada.');
        }

        Response::success($tarea);
    }

    /**
     * Crear nueva tarea
     * POST /api/tareas
     */
    public function store(): void
    {
        AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $proyectoId = !empty($input['proyecto_id']) ? (int)$input['proyecto_id'] : null;
        $titulo = trim($input['titulo'] ?? '');

        // Si no se proporcionó proyecto_id pero se envió el nombre de proyecto
        if (empty($proyectoId) && !empty($input['proyecto'])) {
            $proyectoNombre = trim($input['proyecto']);
            $db = \App\Config\Database::getConnection();
            $stmt = $db->prepare("SELECT id FROM proyectos WHERE nombre LIKE :nombre LIMIT 1");
            $stmt->execute([':nombre' => "%{$proyectoNombre}%"]);
            $p = $stmt->fetch();
            if ($p) {
                $proyectoId = (int)$p['id'];
            }
        }

        // Si aún no hay proyecto_id, asignar el primer proyecto registrado
        if (empty($proyectoId)) {
            $primerP = \App\Config\Database::getConnection()->query("SELECT id FROM proyectos ORDER BY id ASC LIMIT 1")->fetch();
            if ($primerP) {
                $proyectoId = (int)$primerP['id'];
            }
        }

        if (empty($proyectoId) || empty($titulo)) {
            Response::error('El proyecto asociado y el título de la tarea son requeridos.', 422);
        }

        $input['proyecto_id'] = $proyectoId;

        // Normalizar responsable_id a asignado_a si corresponde
        if (!isset($input['asignado_a']) && isset($input['responsable_id'])) {
            $input['asignado_a'] = !empty($input['responsable_id']) ? (int)$input['responsable_id'] : null;
        }

        // Si viene responsable por nombre
        if (empty($input['asignado_a']) && !empty($input['responsable'])) {
            $respNombre = trim($input['responsable']);
            $db = \App\Config\Database::getConnection();
            $stmt = $db->prepare("SELECT id FROM usuarios WHERE nombre LIKE :nombre LIMIT 1");
            $stmt->execute([':nombre' => "%{$respNombre}%"]);
            $u = $stmt->fetch();
            if ($u) {
                $input['asignado_a'] = (int)$u['id'];
            }
        }

        // Normalizar fecha
        if (!isset($input['fecha_vencimiento']) && isset($input['fecha_limite'])) {
            $input['fecha_vencimiento'] = $input['fecha_limite'];
        }

        $id = $this->tareaModel->create($input);
        $tarea = $this->tareaModel->findById($id);

        Response::success($tarea, 'Tarea creada satisfactoriamente', 201);
    }

    /**
     * Actualizar tarea
     * PUT /api/tareas/{id}
     */
    public function update(int $id): void
    {
        AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $tarea = $this->tareaModel->findById($id);
        if (!$tarea) {
            Response::notFound('Tarea no encontrada.');
        }

        $this->tareaModel->update($id, $input);
        $actualizada = $this->tareaModel->findById($id);

        Response::success($actualizada, 'Tarea actualizada con éxito');
    }

    /**
     * Eliminar tarea
     * DELETE /api/tareas/{id}
     */
    public function delete(int $id): void
    {
        AuthMiddleware::authenticate();
        $tarea = $this->tareaModel->findById($id);

        if (!$tarea) {
            Response::notFound('Tarea no encontrada.');
        }

        $this->tareaModel->delete($id);
        Response::success(null, 'Tarea eliminada exitosamente');
    }
}
