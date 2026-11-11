<?php

namespace App\Middleware;

use App\Utils\JWT;
use App\Utils\Response;

class AuthMiddleware
{
    private static ?array $authenticatedUser = null;

    /**
     * Valida que la petición cuente con un token JWT válido
     * @return array Datos del usuario autenticado
     */
    public static function authenticate(): array
    {
        $token = JWT::getBearerToken();

        if (!$token) {
            Response::unauthorized('Token de autorización no proporcionado en la cabecera.');
        }

        $decoded = JWT::decode($token);

        if (!$decoded) {
            Response::unauthorized('El token proporcionado es inválido o ha expirado.');
        }

        self::$authenticatedUser = $decoded;
        return $decoded;
    }

    /**
     * Valida la autenticación y que el usuario tenga al menos uno de los roles requeridos
     */
    public static function authorize(array $allowedRoles): array
    {
        $user = self::authenticate();
        $userRole = $user['rol'] ?? null;

        if (!$userRole || !in_array($userRole, $allowedRoles, true)) {
            Response::forbidden('Acceso denegado: tu rol (' . ($userRole ?? 'desconocido') . ') no tiene permisos para esta acción.');
        }

        return $user;
    }

    /**
     * Obtener el usuario autenticado actual en el ciclo de vida de la petición
     */
    public static function getUser(): ?array
    {
        return self::$authenticatedUser;
    }
}
