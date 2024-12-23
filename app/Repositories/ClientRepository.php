<?php

namespace App\Repositories;

use App\Models\Client;
use App\Repositories\BaseRepository;

class ClientRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'name',
        'email',
        'password'
    ];

    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    public function model(): string
    {
        return Client::class;
    }
}
