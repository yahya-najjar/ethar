<?php

namespace App\Repositories;

use App\Models\Campaign;
use App\Repositories\BaseRepository;

class CampaignRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'charity_organization_id',
        'category_id',
        'title',
        'description',
        'goal_amount',
        'raised_amount',
        'start_date',
        'end_date',
        'status'
    ];

    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    public function model(): string
    {
        return Campaign::class;
    }
}
