<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CharityOrganization extends Model
{
    public $table = 'charity_organizations';

    public $fillable = [
        'name',
        'description',
        'email',
        'phone',
        'website'
    ];

    protected $casts = [
        'name' => 'string',
        'description' => 'string',
        'email' => 'string',
        'phone' => 'string',
        'website' => 'string'
    ];

    public static array $rules = [
        'name' => 'required',
        'description' => 'nullable',
        'email' => 'required|email|unique:charity_organizations',
        'phone' => 'nullable',
        'website' => 'nullable'
    ];

    public function __toString()
    {
        return $this->name;
    }


}
