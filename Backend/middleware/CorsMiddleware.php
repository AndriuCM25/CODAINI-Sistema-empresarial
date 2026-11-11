<?php

namespace App\Middleware;

use App\Config\CorsConfig;

class CorsMiddleware
{
    public static function handle(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowedOrigins = CorsConfig::getAllowedOrigins();

        if (!empty($origin)) {
            $isAllowed = in_array('*', $allowedOrigins, true)
                || in_array($origin, $allowedOrigins, true)
                || (bool)preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin);

            if ($isAllowed) {
                header("Access-Control-Allow-Origin: {$origin}");
            }
        }

        $methods = implode(', ', CorsConfig::getAllowedMethods());
        $headers = implode(', ', CorsConfig::getAllowedHeaders());

        header("Access-Control-Allow-Methods: {$methods}");
        header("Access-Control-Allow-Headers: {$headers}");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 86400");

        if (isset($_SERVER['REQUEST_METHOD']) && strtoupper($_SERVER['REQUEST_METHOD']) === 'OPTIONS') {
            http_response_code(200);
            exit(0);
        }
    }
}