<?php

namespace App\Routes;

use App\Controllers\AuthController;
use App\Controllers\UsuarioController;
use App\Controllers\ClienteController;
use App\Controllers\ProyectoController;
use App\Controllers\TareaController;
use App\Controllers\AsistenciaController;
use App\Controllers\CapacitacionController;
use App\Controllers\DashboardController;
use App\Controllers\GeminiController;
use App\Utils\Response;

class Router
{
    private array $routes = [];

    public function add(string $method, string $path, array $handler): void
    {
        $this->routes[] = [
            'method'  => strtoupper($method),
            'pattern' => $this->convertPathToRegex($path),
            'handler' => $handler
        ];
    }

    public function get(string $path, array $handler): void
    {
        $this->add('GET', $path, $handler);
    }

    public function post(string $path, array $handler): void
    {
        $this->add('POST', $path, $handler);
    }

    public function put(string $path, array $handler): void
    {
        $this->add('PUT', $path, $handler);
    }

    public function delete(string $path, array $handler): void
    {
        $this->add('DELETE', $path, $handler);
    }

    private function convertPathToRegex(string $path): string
    {
        // Reemplaza {id} o {param} por regex capturador
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $path);
        return '#^' . $pattern . '$#';
    }

    public function dispatch(string $requestMethod, string $requestUri): void
    {
        $parsedUri = parse_url($requestUri, PHP_URL_PATH);
        
        // Normalizar eliminando trailing slash a excepción de raíz
        if ($parsedUri !== '/' && substr($parsedUri, -1) === '/') {
            $parsedUri = rtrim($parsedUri, '/');
        }

        foreach ($this->routes as $route) {
            if ($route['method'] === $requestMethod && preg_match($route['pattern'], $parsedUri, $matches)) {
                $params = [];
                foreach ($matches as $key => $value) {
                    if (!is_int($key)) {
                        $params[$key] = is_numeric($value) ? (int)$value : $value;
                    }
                }

                [$controllerClass, $methodName] = $route['handler'];
                $controllerInstance = new $controllerClass();
                
                call_user_func_array([$controllerInstance, $methodName], $params);
                return;
            }
        }

        Response::notFound("Ruta no encontrada: {$requestMethod} {$parsedUri}");
    }
}

// Configuración y registro de rutas de la API
$router = new Router();

// -------------------------------------------------------------
// Rutas de Salud y Diagnóstico
// -------------------------------------------------------------
$router->get('/api', [AuthController::class, 'health']);
$router->get('/api/health', [AuthController::class, 'health']); 

// -------------------------------------------------------------
// Rutas de Autenticación y Perfil
// -------------------------------------------------------------
$router->post('/api/auth/login', [AuthController::class, 'login']);
$router->post('/api/auth/register', [AuthController::class, 'register']);
$router->post('/api/auth/logout', [AuthController::class, 'logout']);
$router->get('/api/auth/me', [AuthController::class, 'me']);
$router->get('/api/profile', [AuthController::class, 'me']);
$router->put('/api/profile', [AuthController::class, 'updateProfile']);

// -------------------------------------------------------------
// Rutas de Usuarios
// -------------------------------------------------------------
$router->get('/api/usuarios', [UsuarioController::class, 'index']);
$router->post('/api/usuarios', [UsuarioController::class, 'store']);
$router->get('/api/usuarios/{id}', [UsuarioController::class, 'show']);
$router->put('/api/usuarios/{id}', [UsuarioController::class, 'update']);
$router->delete('/api/usuarios/{id}', [UsuarioController::class, 'delete']);

// -------------------------------------------------------------
// Rutas de Clientes
// -------------------------------------------------------------
$router->get('/api/clientes', [ClienteController::class, 'index']);
$router->post('/api/clientes', [ClienteController::class, 'store']);
$router->get('/api/clientes/{id}', [ClienteController::class, 'show']);
$router->put('/api/clientes/{id}', [ClienteController::class, 'update']);
$router->delete('/api/clientes/{id}', [ClienteController::class, 'delete']);

// -------------------------------------------------------------
// Rutas de Proyectos
// -------------------------------------------------------------
$router->get('/api/proyectos', [ProyectoController::class, 'index']);
$router->post('/api/proyectos', [ProyectoController::class, 'store']);
$router->get('/api/proyectos/{id}', [ProyectoController::class, 'show']);
$router->put('/api/proyectos/{id}', [ProyectoController::class, 'update']);
$router->delete('/api/proyectos/{id}', [ProyectoController::class, 'delete']);

// -------------------------------------------------------------
// Rutas de Tareas
// -------------------------------------------------------------
$router->get('/api/tareas', [TareaController::class, 'index']);
$router->post('/api/tareas', [TareaController::class, 'store']);
$router->get('/api/tareas/{id}', [TareaController::class, 'show']);
$router->put('/api/tareas/{id}', [TareaController::class, 'update']);
$router->delete('/api/tareas/{id}', [TareaController::class, 'delete']);

// -------------------------------------------------------------
// Rutas de Asistencia
// -------------------------------------------------------------
$router->get('/api/asistencias', [AsistenciaController::class, 'index']);
$router->post('/api/asistencias/entrada', [AsistenciaController::class, 'marcarEntrada']);
$router->post('/api/asistencias/salida', [AsistenciaController::class, 'marcarSalida']);
$router->get('/api/asistencias/mi-historial', [AsistenciaController::class, 'miHistorial']);

// -------------------------------------------------------------
// Rutas de Capacitaciones
// -------------------------------------------------------------
$router->get('/api/capacitaciones', [CapacitacionController::class, 'index']);
$router->post('/api/capacitaciones', [CapacitacionController::class, 'store']);
$router->get('/api/capacitaciones/{id}', [CapacitacionController::class, 'show']);
$router->put('/api/capacitaciones/{id}', [CapacitacionController::class, 'update']);
$router->delete('/api/capacitaciones/{id}', [CapacitacionController::class, 'delete']);
$router->get('/api/capacitaciones/{id}/participantes', [CapacitacionController::class, 'participantes']);
$router->post('/api/capacitaciones/{id}/participantes', [CapacitacionController::class, 'agregarParticipante']);

// -------------------------------------------------------------
// Rutas de Dashboard y Reportes
// -------------------------------------------------------------
$router->get('/api/dashboard', [DashboardController::class, 'index']);

// -------------------------------------------------------------
// Rutas de Gemini IA (proxy seguro)
// -------------------------------------------------------------
$router->post('/api/gemini/chat', [GeminiController::class, 'chat']);

return $router;
