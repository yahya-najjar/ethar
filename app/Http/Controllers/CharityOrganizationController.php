<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateCharityOrganizationRequest;
use App\Http\Requests\UpdateCharityOrganizationRequest;
use App\Http\Controllers\AppBaseController;
use App\Repositories\CharityOrganizationRepository;
use Illuminate\Http\Request;
use Flash;

class CharityOrganizationController extends AppBaseController
{
    /** @var CharityOrganizationRepository $charityOrganizationRepository*/
    private $charityOrganizationRepository;

    public function __construct(CharityOrganizationRepository $charityOrganizationRepo)
    {
        $this->charityOrganizationRepository = $charityOrganizationRepo;
    }

    /**
     * Display a listing of the CharityOrganization.
     */
    public function index(Request $request)
    {
        $charityOrganizations = $this->charityOrganizationRepository->paginate(10);

        return view('charity_organizations.index')
            ->with('charityOrganizations', $charityOrganizations);
    }

    /**
     * Show the form for creating a new CharityOrganization.
     */
    public function create()
    {
        return view('charity_organizations.create');
    }

    /**
     * Store a newly created CharityOrganization in storage.
     */
    public function store(CreateCharityOrganizationRequest $request)
    {
        $input = $request->all();

        $charityOrganization = $this->charityOrganizationRepository->create($input);

        Flash::success('Charity Organization saved successfully.');

        return redirect(route('charityOrganizations.index'));
    }

    /**
     * Display the specified CharityOrganization.
     */
    public function show($id)
    {
        $charityOrganization = $this->charityOrganizationRepository->find($id);

        if (empty($charityOrganization)) {
            Flash::error('Charity Organization not found');

            return redirect(route('charityOrganizations.index'));
        }

        return view('charity_organizations.show')->with('charityOrganization', $charityOrganization);
    }

    /**
     * Show the form for editing the specified CharityOrganization.
     */
    public function edit($id)
    {
        $charityOrganization = $this->charityOrganizationRepository->find($id);

        if (empty($charityOrganization)) {
            Flash::error('Charity Organization not found');

            return redirect(route('charityOrganizations.index'));
        }

        return view('charity_organizations.edit')->with('charityOrganization', $charityOrganization);
    }

    /**
     * Update the specified CharityOrganization in storage.
     */
    public function update($id, UpdateCharityOrganizationRequest $request)
    {
        $charityOrganization = $this->charityOrganizationRepository->find($id);

        if (empty($charityOrganization)) {
            Flash::error('Charity Organization not found');

            return redirect(route('charityOrganizations.index'));
        }

        $charityOrganization = $this->charityOrganizationRepository->update($request->all(), $id);

        Flash::success('Charity Organization updated successfully.');

        return redirect(route('charityOrganizations.index'));
    }

    /**
     * Remove the specified CharityOrganization from storage.
     *
     * @throws \Exception
     */
    public function destroy($id)
    {
        $charityOrganization = $this->charityOrganizationRepository->find($id);

        if (empty($charityOrganization)) {
            Flash::error('Charity Organization not found');

            return redirect(route('charityOrganizations.index'));
        }

        $this->charityOrganizationRepository->delete($id);

        Flash::success('Charity Organization deleted successfully.');

        return redirect(route('charityOrganizations.index'));
    }
}
