<?php

namespace App\Utils;

class Response
{
    /**
     * Enviar respuesta JSON arbitraria
     */
    public static function json($data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    /**
     * Respuesta de éxito estandarizada
     */
    public static function success($data = null, string $message = 'Operación realizada con éxito', int $statusCode = 200): void
    {
        self::json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }

    /**
     * Respuesta de error estandarizada
     */
    public static function error(string $message = 'Ocurrió un error en la solicitud', int $statusCode = 400, $errors = null): void
    {
        $payload = [
            'success' => false,
            'message' => $message
        ];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        self::json($payload, $statusCode);
    }

    /**
     * Respuesta 401 No Autorizado
     */
    public static function unauthorized(string $message = 'No autorizado. Se requiere un token válido.'): void
    {
        self::error($message, 401);
    }

    /**
     * Respuesta 403 Prohibido
     */
    public static function forbidden(string $message = 'Acceso denegado. Permisos insuficientes.'): void
    {
        self::error($message, 403);
    }

    /**
     * Respuesta 404 No Encontrado
     */
    public static function notFound(string $message = 'Recurso no encontrado.'): void
    {
        self::error($message, 404);
    }
}
