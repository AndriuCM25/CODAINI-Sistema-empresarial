<?php

namespace App\Config;

use PDO;
use PDOException;
use App\Utils\Response;

class Database
{
    private static ?PDO $instance = null;

    /**
     * Obtener instancia única de la conexión PDO
     */
    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: '127.0.0.1';
            $port = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: '3306';
            $dbName = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'codaini_db';
            $user = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'root';
            $pass = $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: '';
            $charset = 'utf8mb4';

            $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset={$charset}";

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                // Registrar error en log si es necesario
                error_log("Error de conexión a la Base de Datos: " . $e->getMessage());

                $isDebug = filter_var($_ENV['APP_DEBUG'] ?? getenv('APP_DEBUG') ?: true, FILTER_VALIDATE_BOOLEAN);
                
                Response::error(
                    'No se pudo conectar con la base de datos MySQL.',
                    500,
                    $isDebug ? ['detalle' => $e->getMessage()] : null
                );
            }
        }

        return self::$instance;
    }
}
