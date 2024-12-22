<?php

namespace App\Repositories;

use App\Models\Program;
use App\Repositories\BaseRepository;

class ProgramRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'name',
        'slug',
        'image',
        'icon',
        'description',
        'slogan'
    ];

    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    public function model(): string
    {
        return Program::class;
    }
}
