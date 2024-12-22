<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    public $table = 'settings';

    public $fillable = [
        'key',
        'value'
    ];

    protected $casts = [
        'key' => 'string',
        'value' => 'string'
    ];

    public static array $rules = [
        'key' => 'required|unique:settings',
        'value' => 'nullable'
    ];

    
}
