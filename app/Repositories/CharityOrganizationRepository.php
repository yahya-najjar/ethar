<?php

namespace App\Repositories;

use App\Models\CharityOrganization;
use App\Repositories\BaseRepository;

class CharityOrganizationRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'name',
        'description',
        'email',
        'phone',
        'website'
    ];

    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    public function model(): string
    {
        return CharityOrganization::class;
    }
}
