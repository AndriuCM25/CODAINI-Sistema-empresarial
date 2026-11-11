<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Capacitacion
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getAll(): array
    {
        $sql = "
            SELECT 
                c.id, c.tema, c.instructor, c.fecha, c.hora, c.estado, c.created_at, c.updated_at,
                (SELECT COUNT(*) FROM capacitacion_participantes cp WHERE cp.capacitacion_id = c.id) AS total_participantes
            FROM capacitaciones c
            ORDER BY c.fecha DESC, c.hora ASC
        ";
        return $this->db->query($sql)->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $sql = "
            SELECT c.id, c.tema, c.instructor, c.fecha, c.hora, c.estado, c.created_at, c.updated_at
            FROM capacitaciones c
            WHERE c.id = :id
            LIMIT 1
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function create(array $data): int
    {
        $sql = "
            INSERT INTO capacitaciones (tema, instructor, fecha, hora, estado)
            VALUES (:tema, :instructor, :fecha, :hora, :estado)
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':tema'       => $data['tema'],
            ':instructor' => $data['instructor'],
            ':fecha'      => $data['fecha'],
            ':hora'       => $data['hora'],
            ':estado'     => $data['estado'] ?? 'Programada',
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = ['tema', 'instructor', 'fecha', 'hora', 'estado'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "{$field} = :{$field}";
                $params[":{$field}"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE capacitaciones SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM capacitaciones WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function getParticipantes(int $capacitacionId): array
    {
        $sql = "
            SELECT 
                cp.id, cp.capacitacion_id, cp.usuario_id, cp.asistencia_estado, cp.created_at,
                u.nombre AS usuario_nombre, u.email AS usuario_email, u.rol AS usuario_rol
            FROM capacitacion_participantes cp
            INNER JOIN usuarios u ON cp.usuario_id = u.id
            WHERE cp.capacitacion_id = :capacitacion_id
            ORDER BY u.nombre ASC
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':capacitacion_id' => $capacitacionId]);
        return $stmt->fetchAll();
    }

    public function agregarParticipante(int $capacitacionId, int $usuarioId): bool
    {
        $sql = "
            INSERT INTO capacitacion_participantes (capacitacion_id, usuario_id, asistencia_estado)
            VALUES (:capacitacion_id, :usuario_id, 'Pendiente')
            ON DUPLICATE KEY UPDATE asistencia_estado = VALUES(asistencia_estado)
        ";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':capacitacion_id' => $capacitacionId,
            ':usuario_id'      => $usuarioId
        ]);
    }

    public function actualizarEstadoParticipante(int $capacitacionId, int $usuarioId, string $estado): bool
    {
        $sql = "
            UPDATE capacitacion_participantes 
            SET asistencia_estado = :estado
            WHERE capacitacion_id = :capacitacion_id AND usuario_id = :usuario_id
        ";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':estado'          => $estado,
            ':capacitacion_id' => $capacitacionId,
            ':usuario_id'      => $usuarioId
        ]);
    }
}
