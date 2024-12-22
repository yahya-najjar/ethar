<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    public $table = 'donations';

    public $fillable = [
        'user_id',
        'campaign_id',
        'amount'
    ];

    protected $casts = [
        'amount' => 'decimal:2'
    ];

    public static array $rules = [
        'user_id' => 'required',
        'campaign_id' => 'required',
        'amount' => 'required'
    ];

    
}
