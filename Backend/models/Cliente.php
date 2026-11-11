<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Cliente
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("
            SELECT id, nombre_empresa, ruc, contacto_nombre, email, telefono, estado, created_at, updated_at
            FROM clientes 
            ORDER BY id DESC
        ");
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare("
            SELECT id, nombre_empresa, ruc, contacto_nombre, email, telefono, estado, created_at, updated_at
            FROM clientes 
            WHERE id = :id 
            LIMIT 1
        ");
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function findByRuc(string $ruc): ?array
    {
        $stmt = $this->db->prepare("SELECT id FROM clientes WHERE ruc = :ruc LIMIT 1");
        $stmt->execute([':ruc' => $ruc]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare("
            INSERT INTO clientes (nombre_empresa, ruc, contacto_nombre, email, telefono, estado)
            VALUES (:nombre_empresa, :ruc, :contacto_nombre, :email, :telefono, :estado)
        ");

        $stmt->execute([
            ':nombre_empresa' => $data['nombre_empresa'],
            ':ruc'            => $data['ruc'],
            ':contacto_nombre'=> $data['contacto_nombre'],
            ':email'          => $data['email'],
            ':telefono'       => $data['telefono'] ?? null,
            ':estado'         => $data['estado'] ?? 'Activo',
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = [':id' => $id];

        $allowed = ['nombre_empresa', 'ruc', 'contacto_nombre', 'email', 'telefono', 'estado'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "{$field} = :{$field}";
                $params[":{$field}"] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE clientes SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM clientes WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
