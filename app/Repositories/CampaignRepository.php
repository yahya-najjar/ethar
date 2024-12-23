<?php

namespace App\Repositories;

use App\Models\Campaign;
use App\Repositories\BaseRepository;

class CampaignRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'charity_organization_id',
        'category_id',
        'program_id',
        'title',
        'description',
        'goal_amount',
        'raised_amount',
        'visits',
        'beneficiaries_goal',
        'beneficiaries_count',
        'status',
        'city',
        'image'
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
