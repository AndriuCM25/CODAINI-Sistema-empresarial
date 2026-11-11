<?php

/**
 * =====================================================================
 * CODAINI - Sistema Empresarial
 * Front Controller y Enrutador Principal de la API REST
 * =====================================================================
 */

declare(strict_types=1);

// Reporte de errores según entorno
error_reporting(E_ALL);
ini_set('display_errors', '0');

// 1. Carga de Composer o Autoloader PSR-4 Nativo Fallback
$composerAutoload = __DIR__ . '/vendor/autoload.php';

if (file_exists($composerAutoload)) {
    require_once $composerAutoload;
    
    // Carga de variables con vlucas/phpdotenv si está disponible
    if (class_exists(\Dotenv\Dotenv::class) && file_exists(__DIR__ . '/.env')) {
        $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__);
        $dotenv->safeLoad();
    }
} else {
    // Autoloader PSR-4 nativo de respaldo
    spl_autoload_register(function ($class) {
        $prefix = 'App\\';
        $baseDir = __DIR__ . '/';

        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) !== 0) {
            return;
        }

        $classMap = [
            'App\\Config\\CorsConfig' => $baseDir . 'config/cors.php',
            'App\\Config\\JwtConfig'  => $baseDir . 'config/jwt.php',
            'App\\Config\\Database'   => $baseDir . 'config/database.php',
        ];

        if (isset($classMap[$class]) && file_exists($classMap[$class])) {
            require_once $classMap[$class];
            return;
        }

        $relativeClass = substr($class, $len);
        $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

        if (file_exists($file)) {
            require_once $file;
            return;
        }

        // Manejar diferencias entre mayúsculas y minúsculas en carpetas y archivos
        $parts = explode('/', str_replace('\\', '/', $relativeClass));
        if (count($parts) > 1) {
            // e.g. controllers/AuthController.php
            $parts[0] = strtolower($parts[0]);
            $altFile = $baseDir . implode('/', $parts) . '.php';
            if (file_exists($altFile)) {
                require_once $altFile;
                return;
            }
            // e.g. config/cors.php
            $parts[1] = strtolower($parts[1]);
            $altFile2 = $baseDir . implode('/', $parts) . '.php';
            if (file_exists($altFile2)) {
                require_once $altFile2;
                return;
            }
        }
    });

    // Cargador ligero de .env sin librerías externas
    if (file_exists(__DIR__ . '/.env')) {
        $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || strpos($line, '#') === 0) {
                continue;
            }
            if (strpos($line, '=') !== false) {
                [$k, $v] = explode('=', $line, 2);
                $k = trim($k);
                $v = trim($v, " \t\n\r\0\x0B\"'");
                $_ENV[$k] = $v;
                putenv("{$k}={$v}");
            }
        }
    }
}

use App\Middleware\CorsMiddleware;
use App\Utils\Response;

// 2. Manejo de cabeceras CORS y preflight OPTIONS
CorsMiddleware::handle();

// 3. Manejo global de excepciones para garantizar respuestas JSON
set_exception_handler(function (Throwable $e) {
    $isDebug = filter_var($_ENV['APP_DEBUG'] ?? getenv('APP_DEBUG') ?: true, FILTER_VALIDATE_BOOLEAN);
    
    Response::error(
        'Error interno en el servidor.',
        500,
        $isDebug ? [
            'mensaje' => $e->getMessage(),
            'archivo' => $e->getFile(),
            'linea'   => $e->getLine()
        ] : null
    );
});

// 4. Normalizar la ruta URI recibida
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Quitar prefijo del script si se ejecuta desde subcarpeta (e.g., /Backend/index.php o /index.php)
$scriptName = dirname($_SERVER['SCRIPT_NAME'] ?? '');
if ($scriptName !== '/' && !empty($scriptName) && strpos($requestUri, $scriptName) === 0) {
    $requestUri = substr($requestUri, strlen($scriptName));
}

// 5. Cargar enrutador y despachar
$router = require_once __DIR__ . '/routes/api.php';
$router->dispatch($requestMethod, $requestUri);
