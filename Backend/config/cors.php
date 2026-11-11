<?php

namespace App\Config;

class CorsConfig
{
    /**
     * Obtener array de orígenes permitidos
     */
    public static function getAllowedOrigins(): array
    {
        $rawOrigins = $_ENV['CORS_ALLOWED_ORIGINS'] ?? getenv('CORS_ALLOWED_ORIGINS') ?: 'http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173';
        
        $origins = array_map('trim', explode(',', $rawOrigins));
        return array_filter($origins);
    }

    /**
     * Métodos HTTP permitidos
     */
    public static function getAllowedMethods(): array
    {
        return ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'];
    }

    /**
     * Cabeceras permitidas
     */
    public static function getAllowedHeaders(): array
    {
        return [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
            'Origin',
            'Access-Control-Request-Method',
            'Access-Control-Request-Headers'
        ];
    }
}
