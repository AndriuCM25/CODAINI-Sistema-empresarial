<?php

namespace App\Controllers;

use App\Models\Capacitacion;
use App\Utils\Response;
use App\Middleware\AuthMiddleware;

class CapacitacionController
{
    private Capacitacion $capacitacionModel;

    public function __construct()
    {
        $this->capacitacionModel = new Capacitacion();
    }

    /**
     * Listar capacitaciones
     * GET /api/capacitaciones
     */
    public function index(): void
    {
        AuthMiddleware::authenticate();
        $capacitaciones = $this->capacitacionModel->getAll();
        Response::success($capacitaciones);
    }

    /**
     * Ver capacitación por ID
     * GET /api/capacitaciones/{id}
     */
    public function show(int $id): void
    {
        AuthMiddleware::authenticate();
        $capacitacion = $this->capacitacionModel->findById($id);

        if (!$capacitacion) {
            Response::notFound('Capacitación no encontrada.');
        }

        $capacitacion['participantes'] = $this->capacitacionModel->getParticipantes($id);
        Response::success($capacitacion);
    }

    /**
     * Crear capacitación
     * POST /api/capacitaciones
     */
    public function store(): void
    {
        AuthMiddleware::authorize(['Administrador']);
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $tema = trim($input['tema'] ?? $input['nombre'] ?? '');
        $instructor = trim($input['instructor'] ?? '');
        $fecha = $input['fecha'] ?? null;
        $hora = $input['hora'] ?? null;

        if (empty($tema) || empty($instructor) || empty($fecha) || empty($hora)) {
            Response::error('Tema o nombre, instructor, fecha y hora son obligatorios.', 422);
        }

        $input['tema'] = $tema;
        $id = $this->capacitacionModel->create($input);
        $capacitacion = $this->capacitacionModel->findById($id);

        Response::success($capacitacion, 'Capacitación programada con éxito', 201);
    }

    /**
     * Actualizar capacitación
     * PUT /api/capacitaciones/{id}
     */
    public function update(int $id): void
    {
        AuthMiddleware::authorize(['Administrador']);
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $capacitacion = $this->capacitacionModel->findById($id);
        if (!$capacitacion) {
            Response::notFound('Capacitación no encontrada.');
        }

        $this->capacitacionModel->update($id, $input);
        $actualizada = $this->capacitacionModel->findById($id);

        Response::success($actualizada, 'Capacitación modificada con éxito');
    }

    /**
     * Eliminar capacitación
     * DELETE /api/capacitaciones/{id}
     */
    public function delete(int $id): void
    {
        AuthMiddleware::authorize(['Administrador']);
        $capacitacion = $this->capacitacionModel->findById($id);

        if (!$capacitacion) {
            Response::notFound('Capacitación no encontrada.');
        }

        $this->capacitacionModel->delete($id);
        Response::success(null, 'Capacitación eliminada satisfactoriamente');
    }

    /**
     * Listar participantes de una capacitación
     * GET /api/capacitaciones/{id}/participantes
     */
    public function participantes(int $id): void
    {
        AuthMiddleware::authenticate();
        $participantes = $this->capacitacionModel->getParticipantes($id);
        Response::success($participantes);
    }

    /**
     * Inscribir o agregar participante
     * POST /api/capacitaciones/{id}/participantes
     */
    public function agregarParticipante(int $id): void
    {
        $user = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        // Si se provee usuario_id y quien ejecuta es admin, se usa ese; de lo contrario, se inscribe a sí mismo
        $usuarioId = ($user['rol'] === 'Administrador' && isset($input['usuario_id'])) 
            ? (int)$input['usuario_id'] 
            : $user['id'];

        $this->capacitacionModel->agregarParticipante($id, $usuarioId);
        Response::success(null, 'Participante registrado exitosamente en la capacitación');
    }
}
