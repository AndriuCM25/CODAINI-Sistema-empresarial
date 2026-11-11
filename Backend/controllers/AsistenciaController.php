<?php

namespace App\Controllers;

use App\Models\Asistencia;
use App\Utils\Response;
use App\Middleware\AuthMiddleware;

class AsistenciaController
{
    private Asistencia $asistenciaModel;

    public function __construct()
    {
        $this->asistenciaModel = new Asistencia();
    }

    /**
     * Listar asistencias (admite filtro ?fecha=YYYY-MM-DD)
     * GET /api/asistencias
     */
    public function index(): void
    {
        $user = AuthMiddleware::authenticate();
        $fecha = $_GET['fecha'] ?? null;

        // Si es trabajador o cliente, ve solo sus asistencias salvo que sea Administrador
        if ($user['rol'] !== 'Administrador') {
            $asistencias = $this->asistenciaModel->getByUsuario($user['id']);
        } else {
            $asistencias = $this->asistenciaModel->getAll($fecha);
        }

        Response::success($asistencias);
    }

    /**
     * Marcar entrada del usuario actual
     * POST /api/asistencias/entrada
     */
    public function marcarEntrada(): void
    {
        $user = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $hoy = date('Y-m-d');
        $yaRegistrado = $this->asistenciaModel->findByUsuarioAndFecha($user['id'], $hoy);

        if ($yaRegistrado && !empty($yaRegistrado['hora_entrada'])) {
            Response::error('Ya has registrado tu hora de entrada para el día de hoy.', 400);
        }

        $horaEntrada = date('H:i:s');
        $estado = $input['estado'] ?? (date('H:i:s') > '09:05:00' ? 'Tarde' : 'Presente');
        $observaciones = $input['observaciones'] ?? null;

        $this->asistenciaModel->marcarEntrada($user['id'], $horaEntrada, $estado, $observaciones);
        $asistencia = $this->asistenciaModel->findByUsuarioAndFecha($user['id'], $hoy);

        Response::success($asistencia, 'Entrada registrada correctamente', 201);
    }

    /**
     * Marcar salida del usuario actual
     * POST /api/asistencias/salida
     */
    public function marcarSalida(): void
    {
        $user = AuthMiddleware::authenticate();
        $hoy = date('Y-m-d');

        $asistencia = $this->asistenciaModel->findByUsuarioAndFecha($user['id'], $hoy);
        if (!$asistencia) {
            Response::error('Debes registrar tu entrada antes de marcar la salida.', 400);
        }

        if (!empty($asistencia['hora_salida'])) {
            Response::error('Ya has registrado tu salida el día de hoy.', 400);
        }

        $horaSalida = date('H:i:s');
        $this->asistenciaModel->marcarSalida($user['id'], $horaSalida);
        $asistenciaActualizada = $this->asistenciaModel->findByUsuarioAndFecha($user['id'], $hoy);

        Response::success($asistenciaActualizada, 'Salida registrada satisfactoriamente');
    }

    /**
     * Ver historial propio de asistencias
     * GET /api/asistencias/mi-historial
     */
    public function miHistorial(): void
    {
        $user = AuthMiddleware::authenticate();
        $historial = $this->asistenciaModel->getByUsuario($user['id']);
        Response::success($historial);
    }
}
