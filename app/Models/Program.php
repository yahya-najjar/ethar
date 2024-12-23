<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    public $table = 'programs';

    public $fillable = [
        'name',
        'slug',
        'image',
        'icon',
        'description',
        'slogan'
    ];

    protected $casts = [
        'name' => 'string',
        'slug' => 'string',
        'image' => 'string',
        'icon' => 'string',
        'description' => 'string',
        'slogan' => 'string'
    ];

    public static array $rules = [
        'name' => 'required',
        'slug' => 'required|unique:programs',
        'description' => 'nullable'
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
