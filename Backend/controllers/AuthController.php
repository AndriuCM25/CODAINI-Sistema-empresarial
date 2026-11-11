<?php

namespace App\Controllers;

use App\Models\Usuario;
use App\Utils\JWT;
use App\Utils\Response;
use App\Middleware\AuthMiddleware;

class AuthController
{
    private Usuario $usuarioModel;

    public function __construct()
    {
        $this->usuarioModel = new Usuario();
    }

    /**
     * Endpoint de inicio de sesión
     * POST /api/auth/login
     */
    public function login(): void
    {
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            Response::error('Por favor, proporciona correo electrónico y contraseña.', 422);
        }

        $user = $this->usuarioModel->findByEmail($email);

        if (!$user) {
            Response::error('Credenciales incorrectas.', 401);
        }

        if ($user['estado'] !== 'Activo') {
            Response::forbidden('Esta cuenta se encuentra inactiva. Contacta al administrador.');
        }

        if (!password_verify($password, $user['password_hash'])) {
            Response::error('Credenciales incorrectas.', 401);
        }

        // Generar JWT
        $payload = [
            'id'     => (int)$user['id'],
            'nombre' => $user['nombre'],
            'email'  => $user['email'],
            'rol'    => $user['rol']
        ];

        $token = JWT::generate($payload);

        // Ocultar hash de contraseña
        unset($user['password_hash']);

        Response::success([
            'token' => $token,
            'user'  => $user
        ], 'Inicio de sesión exitoso');
    }

    /**
     * Obtener perfil del usuario autenticado
     * GET /api/auth/me
     */
    public function me(): void
    {
        $authUser = AuthMiddleware::authenticate();
        $user = $this->usuarioModel->findById($authUser['id']);

        if (!$user) {
            Response::notFound('Usuario no encontrado.');
        }

        unset($user['password_hash']);
        Response::success($user, 'Perfil obtenido correctamente');
    }

    /**
     * Endpoint de salud del servidor
     * GET /api/health
     */
    public function health(): void
    {
        Response::success([
            'status'    => 'online',
            'sistema'   => 'CODAINI - Sistema Empresarial API',
            'timestamp' => date('Y-m-d H:i:s'),
            'version'   => '1.0.0'
        ], 'API CODAINI en funcionamiento');
    }

    /**
     * Actualizar perfil del usuario autenticado
     * PUT /api/profile
     */
    public function updateProfile(): void
    {
        $authUser = AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $id = (int)$authUser['id'];
        $user = $this->usuarioModel->findById($id);

        if (!$user) {
            Response::notFound('Usuario no encontrado.');
        }

        $updateData = [];
        if (isset($input['nombre']) || isset($input['apellidos'])) {
            $nombre = trim($input['nombre'] ?? '');
            $apellidos = trim($input['apellidos'] ?? '');
            $nombreCompleto = trim($nombre . ' ' . $apellidos);
            if (!empty($nombreCompleto)) {
                $updateData['nombre'] = $nombreCompleto;
            }
        }
        if (isset($input['telefono'])) {
            $updateData['telefono'] = trim($input['telefono']);
        }
        if (!empty($input['password'])) {
            if (strlen($input['password']) < 6) {
                Response::error('La nueva contraseña debe tener al menos 6 caracteres.', 422);
            }
            $updateData['password'] = $input['password'];
        }

        if (!empty($updateData)) {
            $this->usuarioModel->update($id, $updateData);
        }

        $userActualizado = $this->usuarioModel->findById($id);
        unset($userActualizado['password_hash']);

        Response::success($userActualizado, 'Perfil actualizado correctamente');
    }

    /**
     * Registro de nuevo usuario
     * POST /api/auth/register
     */
    public function register(): void
    {
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $nombre = trim($input['nombre'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';
        $rol = $input['rol'] ?? 'Trabajador';
        $telefono = trim($input['telefono'] ?? '');

        if (empty($nombre) || empty($email) || empty($password)) {
            Response::error('Los campos nombre, email y contraseña son obligatorios.', 422);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('El formato del correo electrónico es inválido.', 422);
        }

        if (strlen($password) < 6) {
            Response::error('La contraseña debe tener al menos 6 caracteres.', 422);
        }

        if ($this->usuarioModel->findByEmail($email)) {
            Response::error('El correo electrónico ya está registrado en la plataforma.', 409);
        }

        $userId = $this->usuarioModel->create([
            'nombre'   => $nombre,
            'email'    => $email,
            'password' => $password,
            'rol'      => in_array($rol, ['Administrador', 'Trabajador', 'Cliente']) ? $rol : 'Trabajador',
            'telefono' => $telefono ?: null,
            'estado'   => 'Activo'
        ]);

        $nuevoUsuario = $this->usuarioModel->findById($userId);

        Response::success($nuevoUsuario, 'Usuario registrado con éxito', 201);
    }

    /**
     * Cierre de sesión (invalidación lógica de cliente)
     * POST /api/auth/logout
     */
    public function logout(): void
    {
        // En arquitecturas JWT sin blacklist en Redis, el cliente elimina el token del almacenamiento local.
        Response::success(null, 'Sesión finalizada exitosamente.');
    }
}
