<?php

namespace App\Utils;

use App\Config\JwtConfig;
use Exception;

class JWT
{
    /**
     * Generar un token JWT con payload y tiempo de expiración
     */
    public static function generate(array $payload, ?int $expireSeconds = null): string
    {
        $issuedAt = time();
        $expire = $issuedAt + ($expireSeconds ?? JwtConfig::getExpire());
        $secret = JwtConfig::getSecret();
        $algo = JwtConfig::getAlgo();

        $tokenPayload = array_merge([
            'iat' => $issuedAt,
            'exp' => $expire,
            'iss' => 'codaini-api'
        ], $payload);

        // Si la librería Firebase está disponible vía composer, usarla
        if (class_exists(\Firebase\JWT\JWT::class)) {
            return \Firebase\JWT\JWT::encode($tokenPayload, $secret, $algo);
        }

        // Fallback nativo HS256 conforme a RFC 7519
        return self::encodeNative($tokenPayload, $secret);
    }

    /**
     * Validar y decodificar un token JWT
     */
    public static function decode(string $token): ?array
    {
        try {
            $secret = JwtConfig::getSecret();
            $algo = JwtConfig::getAlgo();

            if (class_exists(\Firebase\JWT\JWT::class) && class_exists(\Firebase\JWT\Key::class)) {
                $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key($secret, $algo));
                return json_decode(json_encode($decoded), true);
            }

            return self::decodeNative($token, $secret);
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Extraer el token Bearer desde los encabezados HTTP
     */
    public static function getBearerToken(): ?string
    {
        $headers = self::getAuthorizationHeader();
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/i', $headers, $matches)) {
                return $matches[1];
            }
        }
        return null;
    }

    /**
     * Obtener el encabezado de autorización
     */
    private static function getAuthorizationHeader(): ?string
    {
        if (isset($_SERVER['Authorization'])) {
            return trim($_SERVER['Authorization']);
        }
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            return trim($_SERVER['HTTP_AUTHORIZATION']);
        }
        if (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            if (isset($requestHeaders['Authorization'])) {
                return trim($requestHeaders['Authorization']);
            }
        }
        return null;
    }

    /**
     * Codificador nativo HS256
     */
    private static function encodeNative(array $payload, string $secret): string
    {
        $header = ['typ' => 'JWT', 'alg' => 'HS256'];
        $base64UrlHeader = self::base64UrlEncode(json_encode($header));
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac('sha256', $base64UrlHeader . '.' . $base64UrlPayload, $secret, true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        return $base64UrlHeader . '.' . $base64UrlPayload . '.' . $base64UrlSignature;
    }

    /**
     * Decodificador nativo HS256 con verificación de firma y expiración
     */
    private static function decodeNative(string $token, string $secret): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$base64UrlHeader, $base64UrlPayload, $base64UrlSignature] = $parts;

        // Validar firma
        $expectedSignature = hash_hmac('sha256', $base64UrlHeader . '.' . $base64UrlPayload, $secret, true);
        $expectedBase64UrlSignature = self::base64UrlEncode($expectedSignature);

        if (!hash_equals($expectedBase64UrlSignature, $base64UrlSignature)) {
            return null;
        }

        $payload = json_decode(self::base64UrlDecode($base64UrlPayload), true);
        if (!$payload || !is_array($payload)) {
            return null;
        }

        // Validar expiración
        if (isset($payload['exp']) && time() >= $payload['exp']) {
            return null;
        }

        return $payload;
    }

    private static function base64UrlEncode(string $data): string
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    private static function base64UrlDecode(string $data): string
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
    }
}
