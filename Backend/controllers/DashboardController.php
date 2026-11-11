<?php

namespace App\Controllers;

use App\Config\Database;
use App\Utils\Response;
use App\Middleware\AuthMiddleware;
use PDO;

class DashboardController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Obtener estadísticas consolidadas para las tarjetas y gráficos del frontend
     * GET /api/dashboard
     */
    public function index(): void
    {
        AuthMiddleware::authenticate();

        // 1. Contadores generales
        $totalUsuarios = (int)$this->db->query("SELECT COUNT(*) FROM usuarios WHERE estado = 'Activo'")->fetchColumn();
        $totalClientes = (int)$this->db->query("SELECT COUNT(*) FROM clientes WHERE estado = 'Activo'")->fetchColumn();
        $totalProyectos = (int)$this->db->query("SELECT COUNT(*) FROM proyectos")->fetchColumn();
        $totalTareasPendientes = (int)$this->db->query("SELECT COUNT(*) FROM tareas WHERE estado != 'Completada'")->fetchColumn();

        // 2. Proyectos agrupados por estado
        $proyectosPorEstado = $this->db->query("
            SELECT estado, COUNT(*) as cantidad 
            FROM proyectos 
            GROUP BY estado
        ")->fetchAll();

        // 3. Tareas agrupadas por estado
        $tareasPorEstado = $this->db->query("
            SELECT estado, COUNT(*) as cantidad 
            FROM tareas 
            GROUP BY estado
        ")->fetchAll();

        // 4. Presupuesto total de proyectos
        $presupuestoTotal = (float)$this->db->query("SELECT COALESCE(SUM(presupuesto), 0) FROM proyectos")->fetchColumn();

        // 5. Asistencias del día de hoy
        $hoy = date('Y-m-d');
        $asistenciasHoy = $this->db->query("
            SELECT estado, COUNT(*) as cantidad 
            FROM asistencias 
            WHERE fecha = '{$hoy}' 
            GROUP BY estado
        ")->fetchAll();

        // 6. Próximas capacitaciones
        $proximasCapacitaciones = $this->db->query("
            SELECT id, tema, instructor, fecha, hora, estado 
            FROM capacitaciones 
            WHERE fecha >= '{$hoy}' 
            ORDER BY fecha ASC, hora ASC 
            LIMIT 5
        ")->fetchAll();

        Response::success([
            'resumen' => [
                'total_usuarios'          => $totalUsuarios,
                'total_clientes'          => $totalClientes,
                'total_proyectos'         => $totalProyectos,
                'tareas_pendientes'       => $totalTareasPendientes,
                'presupuesto_total'       => $presupuestoTotal
            ],
            'graficos' => [
                'proyectos_por_estado'    => $proyectosPorEstado,
                'tareas_por_estado'       => $tareasPorEstado,
                'asistencias_hoy'         => $asistenciasHoy
            ],
            'proximas_capacitaciones'     => $proximasCapacitaciones
        ], 'Datos del dashboard cargados correctamente');
    }
}
