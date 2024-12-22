<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\API\CreateDonationAPIRequest;
use App\Http\Requests\API\UpdateDonationAPIRequest;
use App\Models\Donation;
use App\Repositories\DonationRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\AppBaseController;

/**
 * Class DonationAPIController
 */
class DonationAPIController extends AppBaseController
{
    private DonationRepository $donationRepository;

    public function __construct(DonationRepository $donationRepo)
    {
        $this->donationRepository = $donationRepo;
    }

    /**
     * Display a listing of the Donations.
     * GET|HEAD /donations
     */
    public function index(Request $request): JsonResponse
    {
        $donations = $this->donationRepository->all(
            $request->except(['skip', 'limit']),
            $request->get('skip'),
            $request->get('limit')
        );

        return $this->sendResponse($donations->toArray(), 'Donations retrieved successfully');
    }

    /**
     * Store a newly created Donation in storage.
     * POST /donations
     */
    public function store(CreateDonationAPIRequest $request): JsonResponse
    {
        $input = $request->all();

        $donation = $this->donationRepository->create($input);

        return $this->sendResponse($donation->toArray(), 'Donation saved successfully');
    }

    /**
     * Display the specified Donation.
     * GET|HEAD /donations/{id}
     */
    public function show($id): JsonResponse
    {
        /** @var Donation $donation */
        $donation = $this->donationRepository->find($id);

        if (empty($donation)) {
            return $this->sendError('Donation not found');
        }

        return $this->sendResponse($donation->toArray(), 'Donation retrieved successfully');
    }

    /**
     * Update the specified Donation in storage.
     * PUT/PATCH /donations/{id}
     */
    public function update($id, UpdateDonationAPIRequest $request): JsonResponse
    {
        $input = $request->all();

        /** @var Donation $donation */
        $donation = $this->donationRepository->find($id);

        if (empty($donation)) {
            return $this->sendError('Donation not found');
        }

        $donation = $this->donationRepository->update($input, $id);

        return $this->sendResponse($donation->toArray(), 'Donation updated successfully');
    }

    /**
     * Remove the specified Donation from storage.
     * DELETE /donations/{id}
     *
     * @throws \Exception
     */
    public function destroy($id): JsonResponse
    {
        /** @var Donation $donation */
        $donation = $this->donationRepository->find($id);

        if (empty($donation)) {
            return $this->sendError('Donation not found');
        }

        $donation->delete();

        return $this->sendSuccess('Donation deleted successfully');
    }
}
