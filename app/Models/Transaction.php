<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    public $table = 'transactions';

    public $fillable = [
        'donation_id',
        'transaction_id',
        'status'
    ];

    protected $casts = [
        'transaction_id' => 'string'
    ];

    public static array $rules = [
        'donation_id' => 'required',
        'transaction_id' => 'required|unique:transactions',
        'status' => 'required'
    ];

    
}
