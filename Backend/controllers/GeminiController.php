<?php

namespace App\Controllers;

use App\Utils\Response;

/**
 * GeminiController
 * Proxy seguro hacia la API de Google Gemini.
 * Evita CORS y mantiene la API Key en el servidor.
 */
class GeminiController
{
    private string $apiKey;
    private string $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent';

    public function __construct()
    {
        $this->apiKey = $_ENV['GEMINI_API_KEY'] ?? getenv('GEMINI_API_KEY') ?? '';
    }

    /**
     * POST /api/gemini/chat
     * Body: { "contents": [...], "systemInstruction": "..." }
     */
    public function chat(): void
    {
        if (empty($this->apiKey)) {
            Response::error('GEMINI_API_KEY no configurada en el servidor.', 503);
            return;
        }

        $body = json_decode(file_get_contents('php://input'), true);

        if (empty($body['contents'])) {
            Response::error('El campo "contents" es requerido.', 400);
            return;
        }

        // Construir payload para Gemini
        $payload = [
            'contents' => $body['contents'],
        ];

        // System instruction si se envía
        if (!empty($body['systemInstruction'])) {
            $payload['systemInstruction'] = [
                'parts' => [['text' => $body['systemInstruction']]]
            ];
        }

        // Configuración de generación opcional
        $payload['generationConfig'] = [
            'temperature'     => 0.7,
            'maxOutputTokens' => 1024,
        ];

        // Llamada a la API de Gemini con cURL — usando ?key= como indica Google
        $url = $this->endpoint . '?key=' . urlencode($this->apiKey);
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
            ],
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_CONNECTTIMEOUT => 15,
            CURLOPT_SSL_VERIFYPEER => false,   // evita problemas de CA en Windows
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_IPRESOLVE      => CURL_IPRESOLVE_V4,  // fuerza IPv4
            CURLOPT_FOLLOWLOCATION => true,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            Response::error('Error de conexión con Gemini: ' . $curlError, 502);
            return;
        }

        $data = json_decode($response, true);

        if ($httpCode !== 200) {
            $errorMsg = $data['error']['message'] ?? 'Error desconocido de Gemini';
            Response::error($errorMsg, $httpCode);
            return;
        }

        // Extraer texto de la respuesta
        $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

        http_response_code(200);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'text'    => $text,
            'usage'   => $data['usageMetadata'] ?? null,
        ]);
    }
}
