<?php

namespace App\Controllers;

use App\Models\Cliente;
use App\Utils\Response;
use App\Middleware\AuthMiddleware;

class ClienteController
{
    private Cliente $clienteModel;

    public function __construct()
    {
        $this->clienteModel = new Cliente();
    }

    /**
     * Listar clientes
     * GET /api/clientes
     */
    public function index(): void
    {
        AuthMiddleware::authenticate();
        $clientes = $this->clienteModel->getAll();
        Response::success($clientes);
    }

    /**
     * Obtener cliente por ID
     * GET /api/clientes/{id}
     */
    public function show(int $id): void
    {
        AuthMiddleware::authenticate();
        $cliente = $this->clienteModel->findById($id);

        if (!$cliente) {
            Response::notFound('Cliente no encontrado.');
        }

        Response::success($cliente);
    }

    /**
     * Crear un nuevo cliente
     * POST /api/clientes
     */
    public function store(): void
    {
        AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

        $nombreEmpresa = trim($input['nombre_empresa'] ?? '');
        $ruc = trim($input['ruc'] ?? '');
        $contactoNombre = trim($input['contacto_nombre'] ?? '');
        $email = trim($input['email'] ?? '');

        if (empty($nombreEmpresa) || empty($ruc) || empty($contactoNombre) || empty($email)) {
            Response::error('Empresa, RUC, Contacto y Email son campos obligatorios.', 422);
        }

        if ($this->clienteModel->findByRuc($ruc)) {
            Response::error('Ya existe un cliente registrado con este número de RUC.', 409);
        }

        $id = $this->clienteModel->create($input);
        $cliente = $this->clienteModel->findById($id);

        Response::success($cliente, 'Cliente registrado exitosamente', 201);
    }

    /**
     * Actualizar cliente
     * PUT /api/clientes/{id}
     */
    public function update(int $id): void
    {
        AuthMiddleware::authenticate();
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        $cliente = $this->clienteModel->findById($id);
        if (!$cliente) {
            Response::notFound('Cliente no encontrado.');
        }

        if (isset($input['ruc']) && $input['ruc'] !== $cliente['ruc']) {
            $existente = $this->clienteModel->findByRuc($input['ruc']);
            if ($existente && $existente['id'] !== $id) {
                Response::error('El RUC especificado ya pertenece a otra empresa.', 409);
            }
        }

        $this->clienteModel->update($id, $input);
        $clienteActualizado = $this->clienteModel->findById($id);

        Response::success($clienteActualizado, 'Cliente actualizado con éxito');
    }

    /**
     * Eliminar cliente
     * DELETE /api/clientes/{id}
     */
    public function delete(int $id): void
    {
        AuthMiddleware::authorize(['Administrador']);
        $cliente = $this->clienteModel->findById($id);

        if (!$cliente) {
            Response::notFound('Cliente no encontrado.');
        }

        $this->clienteModel->delete($id);
        Response::success(null, 'Cliente eliminado satisfactoriamente');
    }
}
