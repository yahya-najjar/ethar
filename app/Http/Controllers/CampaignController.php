<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateCampaignRequest;
use App\Http\Requests\UpdateCampaignRequest;
use App\Http\Controllers\AppBaseController;
use App\Models\Category;
use App\Models\CharityOrganization;
use App\Repositories\CampaignRepository;
use Illuminate\Http\Request;
use Flash;

class CampaignController extends AppBaseController
{
    /** @var CampaignRepository $campaignRepository*/
    private $campaignRepository;

    public function __construct(CampaignRepository $campaignRepo)
    {
        $this->campaignRepository = $campaignRepo;
    }

    /**
     * Display a listing of the Campaign.
     */
    public function index(Request $request)
    {
        $campaigns = $this->campaignRepository->paginate(10);

        return view('campaigns.index')
            ->with('campaigns', $campaigns);
    }

    /**
     * Show the form for creating a new Campaign.
     */
    public function create()
    {
        $categories = Category::query()->get();
        $charities = CharityOrganization::query()->get();
        return view('campaigns.create', compact('categories', 'charities'));
    }

    /**
     * Store a newly created Campaign in storage.
     */
    public function store(CreateCampaignRequest $request)
    {
        $input = $request->all();

        $campaign = $this->campaignRepository->create($input);

        Flash::success('Campaign saved successfully.');

        return redirect(route('campaigns.index'));
    }

    /**
     * Display the specified Campaign.
     */
    public function show($id)
    {
        $campaign = $this->campaignRepository->find($id);

        if (empty($campaign)) {
            Flash::error('Campaign not found');

            return redirect(route('campaigns.index'));
        }

        return view('campaigns.show')->with('campaign', $campaign);
    }

    /**
     * Show the form for editing the specified Campaign.
     */
    public function edit($id)
    {
        $campaign = $this->campaignRepository->find($id);

        if (empty($campaign)) {
            Flash::error('Campaign not found');

            return redirect(route('campaigns.index'));
        }
        $categories = Category::query()->get();
        $charities = CharityOrganization::query()->get();

        return view('campaigns.edit', compact('campaign', 'categories', 'charities'));
    }

    /**
     * Update the specified Campaign in storage.
     */
    public function update($id, UpdateCampaignRequest $request)
    {
        $campaign = $this->campaignRepository->find($id);

        if (empty($campaign)) {
            Flash::error('Campaign not found');

            return redirect(route('campaigns.index'));
        }

        $campaign = $this->campaignRepository->update($request->all(), $id);

        Flash::success('Campaign updated successfully.');

        return redirect(route('campaigns.index'));
    }

    /**
     * Remove the specified Campaign from storage.
     *
     * @throws \Exception
     */
    public function destroy($id)
    {
        $campaign = $this->campaignRepository->find($id);

        if (empty($campaign)) {
            Flash::error('Campaign not found');

            return redirect(route('campaigns.index'));
        }

        $this->campaignRepository->delete($id);

        Flash::success('Campaign deleted successfully.');

        return redirect(route('campaigns.index'));
    }
}
