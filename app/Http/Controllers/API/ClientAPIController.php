<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\API\CreateClientAPIRequest;
use App\Http\Requests\API\UpdateClientAPIRequest;
use App\Models\Client;
use App\Repositories\ClientRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\AppBaseController;

/**
 * Class ClientAPIController
 */
class ClientAPIController extends AppBaseController
{
    private ClientRepository $clientRepository;

    public function __construct(ClientRepository $clientRepo)
    {
        $this->clientRepository = $clientRepo;
    }

    /**
     * Display a listing of the Clients.
     * GET|HEAD /clients
     */
    public function index(Request $request): JsonResponse
    {
        $clients = $this->clientRepository->all(
            $request->except(['skip', 'limit']),
            $request->get('skip'),
            $request->get('limit')
        );

        return $this->sendResponse($clients->toArray(), 'Clients retrieved successfully');
    }

    /**
     * Store a newly created Client in storage.
     * POST /clients
     */
    public function store(CreateClientAPIRequest $request): JsonResponse
    {
        $input = $request->all();

        $client = $this->clientRepository->create($input);

        return $this->sendResponse($client->toArray(), 'Client saved successfully');
    }

    /**
     * Display the specified Client.
     * GET|HEAD /clients/{id}
     */
    public function show($id): JsonResponse
    {
        /** @var Client $client */
        $client = $this->clientRepository->find($id);

        if (empty($client)) {
            return $this->sendError('Client not found');
        }

        return $this->sendResponse($client->toArray(), 'Client retrieved successfully');
    }

    /**
     * Update the specified Client in storage.
     * PUT/PATCH /clients/{id}
     */
    public function update($id, UpdateClientAPIRequest $request): JsonResponse
    {
        $input = $request->all();

        /** @var Client $client */
        $client = $this->clientRepository->find($id);

        if (empty($client)) {
            return $this->sendError('Client not found');
        }

        $client = $this->clientRepository->update($input, $id);

        return $this->sendResponse($client->toArray(), 'Client updated successfully');
    }

    /**
     * Remove the specified Client from storage.
     * DELETE /clients/{id}
     *
     * @throws \Exception
     */
    public function destroy($id): JsonResponse
    {
        /** @var Client $client */
        $client = $this->clientRepository->find($id);

        if (empty($client)) {
            return $this->sendError('Client not found');
        }

        $client->delete();

        return $this->sendSuccess('Client deleted successfully');
    }
}
