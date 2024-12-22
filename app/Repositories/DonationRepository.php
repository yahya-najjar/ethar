<?php

namespace App\Repositories;

use App\Models\Donation;
use App\Repositories\BaseRepository;

class DonationRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'user_id',
        'campaign_id',
        'amount'
    ];

    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    public function model(): string
    {
        return Donation::class;
    }
}
