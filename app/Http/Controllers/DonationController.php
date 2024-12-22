<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateDonationRequest;
use App\Http\Requests\UpdateDonationRequest;
use App\Http\Controllers\AppBaseController;
use App\Repositories\DonationRepository;
use Illuminate\Http\Request;
use Flash;

class DonationController extends AppBaseController
{
    /** @var DonationRepository $donationRepository*/
    private $donationRepository;

    public function __construct(DonationRepository $donationRepo)
    {
        $this->donationRepository = $donationRepo;
    }

    /**
     * Display a listing of the Donation.
     */
    public function index(Request $request)
    {
        $donations = $this->donationRepository->paginate(10);

        return view('donations.index')
            ->with('donations', $donations);
    }

    /**
     * Show the form for creating a new Donation.
     */
    public function create()
    {
        return view('donations.create');
    }

    /**
     * Store a newly created Donation in storage.
     */
    public function store(CreateDonationRequest $request)
    {
        $input = $request->all();

        $donation = $this->donationRepository->create($input);

        Flash::success('Donation saved successfully.');

        return redirect(route('donations.index'));
    }

    /**
     * Display the specified Donation.
     */
    public function show($id)
    {
        $donation = $this->donationRepository->find($id);

        if (empty($donation)) {
            Flash::error('Donation not found');

            return redirect(route('donations.index'));
        }

        return view('donations.show')->with('donation', $donation);
    }

    /**
     * Show the form for editing the specified Donation.
     */
    public function edit($id)
    {
        $donation = $this->donationRepository->find($id);

        if (empty($donation)) {
            Flash::error('Donation not found');

            return redirect(route('donations.index'));
        }

        return view('donations.edit')->with('donation', $donation);
    }

    /**
     * Update the specified Donation in storage.
     */
    public function update($id, UpdateDonationRequest $request)
    {
        $donation = $this->donationRepository->find($id);

        if (empty($donation)) {
            Flash::error('Donation not found');

            return redirect(route('donations.index'));
        }

        $donation = $this->donationRepository->update($request->all(), $id);

        Flash::success('Donation updated successfully.');

        return redirect(route('donations.index'));
    }

    /**
     * Remove the specified Donation from storage.
     *
     * @throws \Exception
     */
    public function destroy($id)
    {
        $donation = $this->donationRepository->find($id);

        if (empty($donation)) {
            Flash::error('Donation not found');

            return redirect(route('donations.index'));
        }

        $this->donationRepository->delete($id);

        Flash::success('Donation deleted successfully.');

        return redirect(route('donations.index'));
    }
}
