<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Proyecto
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
                p.id, p.nombre, p.descripcion, p.cliente_id, p.responsable_id,
                p.fecha_inicio, p.fecha_fin_estimada, p.presupuesto, p.estado,
                p.created_at, p.updated_at,
                c.nombre_empresa AS cliente_nombre,
                u.nombre AS responsable_nombre
            FROM proyectos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN usuarios u ON p.responsable_id = u.id
            ORDER BY p.id DESC
        ";
        return $this->db->query($sql)->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $sql = "
            SELECT 
                p.id, p.nombre, p.descripcion, p.cliente_id, p.responsable_id,
                p.fecha_inicio, p.fecha_fin_estimada, p.presupuesto, p.estado,
                p.created_at, p.updated_at,
                c.nombre_empresa AS cliente_nombre,
                u.nombre AS responsable_nombre
            FROM proyectos p
            LEFT JOIN clientes c ON p.cliente_id = c.id
            LEFT JOIN usuarios u ON p.responsable_id = u.id
            WHERE p.id = :id
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
            INSERT INTO proyectos (nombre, descripcion, cliente_id, responsable_id, fecha_inicio, fecha_fin_estimada, presupuesto, estado)
            VALUES (:nombre, :descripcion, :cliente_id, :responsable_id, :fecha_inicio, :fecha_fin_estimada, :presupuesto, :estado)
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':nombre'              => $data['nombre'],
            ':descripcion'         => $data['descripcion'] ?? null,
            ':cliente_id'          => $data['cliente_id'],
            ':responsable_id'      => $data['responsable_id'] ?? null,
            ':fecha_inicio'        => $data['fecha_inicio'],
            ':fecha_fin_estimada'  => $data['fecha_fin_estimada'] ?? null,
            ':presupuesto'         => $data['presupuesto'] ?? 0.00,
            ':estado'              => $data['estado'] ?? 'Pendiente',
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = ['nombre', 'descripcion', 'cliente_id', 'responsable_id', 'fecha_inicio', 'fecha_fin_estimada', 'presupuesto', 'estado'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "{$field} = :{$field}";
                $params[":{$field}"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE proyectos SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM proyectos WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
