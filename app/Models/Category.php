<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public $table = 'categories';

    public $fillable = [
        'name',
        'slug',
        'image'
    ];

    protected $casts = [
        'name' => 'string',
        'slug' => 'string',
        'image' => 'string'
    ];

    public static array $rules = [
        'name' => 'required',
        'slug' => 'required|unique:categories'
    ];

    
}
