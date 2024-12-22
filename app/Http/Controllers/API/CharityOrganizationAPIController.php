<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\API\CreateCharityOrganizationAPIRequest;
use App\Http\Requests\API\UpdateCharityOrganizationAPIRequest;
use App\Models\CharityOrganization;
use App\Repositories\CharityOrganizationRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\AppBaseController;

/**
 * Class CharityOrganizationAPIController
 */
class CharityOrganizationAPIController extends AppBaseController
{
    private CharityOrganizationRepository $charityOrganizationRepository;

    public function __construct(CharityOrganizationRepository $charityOrganizationRepo)
    {
        $this->charityOrganizationRepository = $charityOrganizationRepo;
    }

    /**
     * Display a listing of the CharityOrganizations.
     * GET|HEAD /charity-organizations
     */
    public function index(Request $request): JsonResponse
    {
        $charityOrganizations = $this->charityOrganizationRepository->all(
            $request->except(['skip', 'limit']),
            $request->get('skip'),
            $request->get('limit')
        );

        return $this->sendResponse($charityOrganizations->toArray(), 'Charity Organizations retrieved successfully');
    }

    /**
     * Store a newly created CharityOrganization in storage.
     * POST /charity-organizations
     */
    public function store(CreateCharityOrganizationAPIRequest $request): JsonResponse
    {
        $input = $request->all();

        $charityOrganization = $this->charityOrganizationRepository->create($input);

        return $this->sendResponse($charityOrganization->toArray(), 'Charity Organization saved successfully');
    }

    /**
     * Display the specified CharityOrganization.
     * GET|HEAD /charity-organizations/{id}
     */
    public function show($id): JsonResponse
    {
        /** @var CharityOrganization $charityOrganization */
        $charityOrganization = $this->charityOrganizationRepository->find($id);

        if (empty($charityOrganization)) {
            return $this->sendError('Charity Organization not found');
        }

        return $this->sendResponse($charityOrganization->toArray(), 'Charity Organization retrieved successfully');
    }

    /**
     * Update the specified CharityOrganization in storage.
     * PUT/PATCH /charity-organizations/{id}
     */
    public function update($id, UpdateCharityOrganizationAPIRequest $request): JsonResponse
    {
        $input = $request->all();

        /** @var CharityOrganization $charityOrganization */
        $charityOrganization = $this->charityOrganizationRepository->find($id);

        if (empty($charityOrganization)) {
            return $this->sendError('Charity Organization not found');
        }

        $charityOrganization = $this->charityOrganizationRepository->update($input, $id);

        return $this->sendResponse($charityOrganization->toArray(), 'CharityOrganization updated successfully');
    }

    /**
     * Remove the specified CharityOrganization from storage.
     * DELETE /charity-organizations/{id}
     *
     * @throws \Exception
     */
    public function destroy($id): JsonResponse
    {
        /** @var CharityOrganization $charityOrganization */
        $charityOrganization = $this->charityOrganizationRepository->find($id);

        if (empty($charityOrganization)) {
            return $this->sendError('Charity Organization not found');
        }

        $charityOrganization->delete();

        return $this->sendSuccess('Charity Organization deleted successfully');
    }
}
