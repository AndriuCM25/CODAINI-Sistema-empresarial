<?php

namespace App\Config;

class JwtConfig
{
    public static function getSecret(): string
    {
        return $_ENV['JWT_SECRET'] ?? getenv('JWT_SECRET') ?: 'codaini_default_jwt_secret_key_2025';
    }

    public static function getExpire(): int
    {
        return (int)($_ENV['JWT_EXPIRE'] ?? getenv('JWT_EXPIRE') ?: 86400); // 24 horas por defecto
    }

    public static function getAlgo(): string
    {
        return $_ENV['JWT_ALGO'] ?? getenv('JWT_ALGO') ?: 'HS256';
    }
}
