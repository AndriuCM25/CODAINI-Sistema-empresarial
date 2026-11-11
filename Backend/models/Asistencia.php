<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Asistencia
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getAll(?string $fecha = null): array
    {
        $sql = "
            SELECT 
                a.id, a.usuario_id, a.fecha, a.hora_entrada, a.hora_salida,
                a.estado, a.observaciones, a.created_at,
                u.nombre AS usuario_nombre, u.email AS usuario_email
            FROM asistencias a
            INNER JOIN usuarios u ON a.usuario_id = u.id
        ";

        if ($fecha !== null) {
            $sql .= " WHERE a.fecha = :fecha";
            $sql .= " ORDER BY a.hora_entrada ASC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':fecha' => $fecha]);
            return $stmt->fetchAll();
        }

        $sql .= " ORDER BY a.fecha DESC, a.hora_entrada ASC";
        return $this->db->query($sql)->fetchAll();
    }

    public function getByUsuario(int $usuarioId): array
    {
        $sql = "
            SELECT id, usuario_id, fecha, hora_entrada, hora_salida, estado, observaciones, created_at
            FROM asistencias
            WHERE usuario_id = :usuario_id
            ORDER BY fecha DESC
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':usuario_id' => $usuarioId]);
        return $stmt->fetchAll();
    }

    public function findByUsuarioAndFecha(int $usuarioId, string $fecha): ?array
    {
        $sql = "SELECT * FROM asistencias WHERE usuario_id = :usuario_id AND fecha = :fecha LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':usuario_id' => $usuarioId, ':fecha' => $fecha]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function marcarEntrada(int $usuarioId, string $horaEntrada, string $estado = 'Presente', ?string $observaciones = null): int
    {
        $fecha = date('Y-m-d');
        $sql = "
            INSERT INTO asistencias (usuario_id, fecha, hora_entrada, estado, observaciones)
            VALUES (:usuario_id, :fecha, :hora_entrada, :estado, :observaciones)
            ON DUPLICATE KEY UPDATE 
                hora_entrada = VALUES(hora_entrada),
                estado = VALUES(estado),
                observaciones = VALUES(observaciones)
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':usuario_id'    => $usuarioId,
            ':fecha'         => $fecha,
            ':hora_entrada'  => $horaEntrada,
            ':estado'        => $estado,
            ':observaciones' => $observaciones,
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function marcarSalida(int $usuarioId, string $horaSalida): bool
    {
        $fecha = date('Y-m-d');
        $sql = "
            UPDATE asistencias 
            SET hora_salida = :hora_salida 
            WHERE usuario_id = :usuario_id AND fecha = :fecha
        ";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':hora_salida' => $horaSalida,
            ':usuario_id'   => $usuarioId,
            ':fecha'        => $fecha,
        ]);
    }
}
