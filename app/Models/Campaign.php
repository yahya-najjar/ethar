<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    public $table = 'campaigns';

    public $fillable = [
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

    protected $casts = [
        'title' => 'string',
        'description' => 'string',
        'goal_amount' => 'decimal:2',
        'raised_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'status' => 'string'
    ];

    public static array $rules = [
        'charity_organization_id' => 'required',
        'category_id' => 'required',
        'title' => 'required',
        'description' => 'required',
        'goal_amount' => 'required',
        'raised_amount' => 'nullable',
        'start_date' => 'required',
        'end_date' => 'required',
        'status' => 'required'
    ];

    
}
