<?php

namespace App\Controllers;

use App\Models\Usuario;
use App\Utils\Response;
use App\Middleware\AuthMiddleware;

class UsuarioController
{
    private Usuario $usuarioModel;

    public function __construct()
    {
        $this->usuarioModel = new Usuario();
    }

    /**
     * Listar todos los usuarios
     * GET /api/usuarios
     */
    public function index(): void
    {
        AuthMiddleware::authenticate();
        $usuarios = $this->usuarioModel->getAll();
        Response::success($usuarios);
    }

    /**
     * Obtener usuario por ID
     * GET /api/usuarios/{id}
     */
    public function show(int $id): void
    {
        AuthMiddleware::authenticate();
        $usuario = $this->usuarioModel->findById($id);

        if (!$usuario) {
            Response::notFound('Usuario no encontrado.');
        }

        Response::success($usuario);
    }

    /**
     * Crear un nuevo usuario (Solo Administrador)
     * POST /api/usuarios
     */
    public function store(): void
    {
        AuthMiddleware::authorize(['Administrador']);
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $nombre = trim($input['nombre'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($nombre) || empty($email) || empty($password)) {
            Response::error('Los campos nombre, email y contraseña son obligatorios.', 422);
        }

        if ($this->usuarioModel->findByEmail($email)) {
            Response::error('El correo electrónico ya se encuentra registrado.', 409);
        }

        $id = $this->usuarioModel->create($input);
        $usuario = $this->usuarioModel->findById($id);

        Response::success($usuario, 'Usuario creado con éxito', 201);
    }

    /**
     * Actualizar usuario
     * PUT /api/usuarios/{id}
     */
    public function update(int $id): void
    {
        $currentUser = AuthMiddleware::authenticate();

        // Solo Administrador o el mismo usuario pueden editar
        if ($currentUser['rol'] !== 'Administrador' && $currentUser['id'] !== $id) {
            Response::forbidden('No tienes permiso para actualizar este perfil.');
        }

        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        // No permitir que usuarios no administradores cambien su rol
        if ($currentUser['rol'] !== 'Administrador' && isset($input['rol'])) {
            unset($input['rol']);
        }

        $usuario = $this->usuarioModel->findById($id);
        if (!$usuario) {
            Response::notFound('Usuario no encontrado.');
        }

        $this->usuarioModel->update($id, $input);
        $usuarioActualizado = $this->usuarioModel->findById($id);

        Response::success($usuarioActualizado, 'Usuario actualizado exitosamente');
    }

    /**
     * Eliminar usuario (Solo Administrador)
     * DELETE /api/usuarios/{id}
     */
    public function delete(int $id): void
    {
        $currentUser = AuthMiddleware::authorize(['Administrador']);

        if ($currentUser['id'] === $id) {
            Response::error('No puedes eliminar tu propia cuenta en sesión.', 400);
        }

        $usuario = $this->usuarioModel->findById($id);
        if (!$usuario) {
            Response::notFound('Usuario no encontrado.');
        }

        $this->usuarioModel->delete($id);
        Response::success(null, 'Usuario eliminado correctamente');
    }
}
