<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\API\CreateCampaignAPIRequest;
use App\Http\Requests\API\UpdateCampaignAPIRequest;
use App\Models\Campaign;
use App\Repositories\CampaignRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\AppBaseController;

/**
 * Class CampaignAPIController
 */
class CampaignAPIController extends AppBaseController
{
    private CampaignRepository $campaignRepository;

    public function __construct(CampaignRepository $campaignRepo)
    {
        $this->campaignRepository = $campaignRepo;
    }

    /**
     * Display a listing of the Campaigns.
     * GET|HEAD /campaigns
     */
    public function index(Request $request): JsonResponse
    {
        $campaigns = $this->campaignRepository->all(
            $request->except(['skip', 'limit']),
            $request->get('skip'),
            $request->get('limit')
        );

        return $this->sendResponse($campaigns->toArray(), 'Campaigns retrieved successfully');
    }

    /**
     * Store a newly created Campaign in storage.
     * POST /campaigns
     */
    public function store(CreateCampaignAPIRequest $request): JsonResponse
    {
        $input = $request->all();

        $campaign = $this->campaignRepository->create($input);

        return $this->sendResponse($campaign->toArray(), 'Campaign saved successfully');
    }

    /**
     * Display the specified Campaign.
     * GET|HEAD /campaigns/{id}
     */
    public function show($id): JsonResponse
    {
        /** @var Campaign $campaign */
        $campaign = $this->campaignRepository->find($id);

        if (empty($campaign)) {
            return $this->sendError('Campaign not found');
        }

        return $this->sendResponse($campaign->toArray(), 'Campaign retrieved successfully');
    }

    /**
     * Update the specified Campaign in storage.
     * PUT/PATCH /campaigns/{id}
     */
    public function update($id, UpdateCampaignAPIRequest $request): JsonResponse
    {
        $input = $request->all();

        /** @var Campaign $campaign */
        $campaign = $this->campaignRepository->find($id);

        if (empty($campaign)) {
            return $this->sendError('Campaign not found');
        }

        $campaign = $this->campaignRepository->update($input, $id);

        return $this->sendResponse($campaign->toArray(), 'Campaign updated successfully');
    }

    /**
     * Remove the specified Campaign from storage.
     * DELETE /campaigns/{id}
     *
     * @throws \Exception
     */
    public function destroy($id): JsonResponse
    {
        /** @var Campaign $campaign */
        $campaign = $this->campaignRepository->find($id);

        if (empty($campaign)) {
            return $this->sendError('Campaign not found');
        }

        $campaign->delete();

        return $this->sendSuccess('Campaign deleted successfully');
    }
}
