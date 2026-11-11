<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Usuario
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("
            SELECT id, nombre, email, rol, telefono, estado, created_at, updated_at 
            FROM usuarios 
            ORDER BY id DESC
        ");
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare("
            SELECT id, nombre, email, rol, telefono, estado, created_at, updated_at 
            FROM usuarios 
            WHERE id = :id 
            LIMIT 1
        ");
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare("
            SELECT id, nombre, email, password_hash, rol, telefono, estado, created_at 
            FROM usuarios 
            WHERE email = :email 
            LIMIT 1
        ");
        $stmt->execute([':email' => $email]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare("
            INSERT INTO usuarios (nombre, email, password_hash, rol, telefono, estado)
            VALUES (:nombre, :email, :password_hash, :rol, :telefono, :estado)
        ");

        $stmt->execute([
            ':nombre'        => $data['nombre'],
            ':email'         => $data['email'],
            ':password_hash' => password_hash($data['password'], PASSWORD_BCRYPT),
            ':rol'           => $data['rol'] ?? 'Trabajador',
            ':telefono'      => $data['telefono'] ?? null,
            ':estado'        => $data['estado'] ?? 'Activo',
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = [':id' => $id];

        if (isset($data['nombre'])) {
            $fields[] = 'nombre = :nombre';
            $params[':nombre'] = $data['nombre'];
        }
        if (isset($data['email'])) {
            $fields[] = 'email = :email';
            $params[':email'] = $data['email'];
        }
        if (!empty($data['password'])) {
            $fields[] = 'password_hash = :password_hash';
            $params[':password_hash'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }
        if (isset($data['rol'])) {
            $fields[] = 'rol = :rol';
            $params[':rol'] = $data['rol'];
        }
        if (array_key_exists('telefono', $data)) {
            $fields[] = 'telefono = :telefono';
            $params[':telefono'] = $data['telefono'];
        }
        if (isset($data['estado'])) {
            $fields[] = 'estado = :estado';
            $params[':estado'] = $data['estado'];
        }

        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE usuarios SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM usuarios WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
