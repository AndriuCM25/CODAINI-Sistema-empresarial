<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Tarea
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getAll(?int $proyectoId = null): array
    {
        $sql = "
            SELECT 
                t.id, t.proyecto_id, t.titulo, t.descripcion, t.asignado_a,
                t.prioridad, t.estado, t.fecha_vencimiento, t.created_at, t.updated_at,
                p.nombre AS proyecto_nombre,
                u.nombre AS asignado_nombre
            FROM tareas t
            LEFT JOIN proyectos p ON t.proyecto_id = p.id
            LEFT JOIN usuarios u ON t.asignado_a = u.id
        ";

        if ($proyectoId !== null) {
            $sql .= " WHERE t.proyecto_id = :proyecto_id";
            $sql .= " ORDER BY t.id DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':proyecto_id' => $proyectoId]);
            return $stmt->fetchAll();
        }

        $sql .= " ORDER BY t.id DESC";
        return $this->db->query($sql)->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $sql = "
            SELECT 
                t.id, t.proyecto_id, t.titulo, t.descripcion, t.asignado_a,
                t.prioridad, t.estado, t.fecha_vencimiento, t.created_at, t.updated_at,
                p.nombre AS proyecto_nombre,
                u.nombre AS asignado_nombre
            FROM tareas t
            LEFT JOIN proyectos p ON t.proyecto_id = p.id
            LEFT JOIN usuarios u ON t.asignado_a = u.id
            WHERE t.id = :id
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
            INSERT INTO tareas (proyecto_id, titulo, descripcion, asignado_a, prioridad, estado, fecha_vencimiento)
            VALUES (:proyecto_id, :titulo, :descripcion, :asignado_a, :prioridad, :estado, :fecha_vencimiento)
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':proyecto_id'       => $data['proyecto_id'],
            ':titulo'            => $data['titulo'],
            ':descripcion'       => $data['descripcion'] ?? null,
            ':asignado_a'        => $data['asignado_a'] ?? null,
            ':prioridad'         => $data['prioridad'] ?? 'Media',
            ':estado'            => $data['estado'] ?? 'Pendiente',
            ':fecha_vencimiento' => $data['fecha_vencimiento'] ?? null,
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = ['proyecto_id', 'titulo', 'descripcion', 'asignado_a', 'prioridad', 'estado', 'fecha_vencimiento'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "{$field} = :{$field}";
                $params[":{$field}"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE tareas SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM tareas WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
