<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function __toString()
    {
        return $this->name;
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(Campaign::class);
    }


}
