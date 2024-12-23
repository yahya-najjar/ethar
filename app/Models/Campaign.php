<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    public $table = 'campaigns';

    public $fillable = [
        'charity_organization_id',
        'category_id',
        'program_id',
        'title',
        'description',
        'goal_amount',
        'raised_amount',
        'visits',
        'beneficiaries_goal',
        'beneficiaries_count',
        'status',
        'city',
        'image'
    ];

    protected $casts = [
        'title' => 'string',
        'description' => 'string',
        'goal_amount' => 'decimal:2',
        'raised_amount' => 'decimal:2',
        'visits' => 'integer',
        'beneficiaries_goal' => 'integer',
        'beneficiaries_count' => 'integer',
        'status' => 'string',
        'city' => 'string',
        'image' => 'string'
    ];

    public static array $rules = [
        'charity_organization_id' => 'required',
        'category_id' => 'nullable',
        'program_id' => 'nullable',
        'title' => 'required',
        'description' => 'required',
        'goal_amount' => 'required',
        'raised_amount' => 'nullable',
        'visits' => 'nullable',
        'beneficiaries_goal' => 'required',
        'beneficiaries_count' => 'nullable',
        'status' => 'required',
        'city' => 'nullable',
        'image' => 'required'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class, 'program_id');
    }

    public function charity(): BelongsTo
    {
        return $this->belongsTo(CharityOrganization::class, 'charity_organization_id');
    }

    public function getLeftAmountAttribute()
    {
        return round($this->goal_amount - $this->raised_amount, 2);
    }

    public function getPercentageAttribute()
    {
        if ($this->goal_amount > 0) {
            return round(($this->raised_amount / $this->goal_amount) * 100, 0);
        }
        return 0;
    }

        public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }

}
