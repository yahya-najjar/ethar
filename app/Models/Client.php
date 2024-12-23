<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Client extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    public $table = 'clients';

    public $fillable = [
        'name',
        'email',
        'password'
    ];

    protected $casts = [
        'name' => 'string',
        'email' => 'string',
        'password' => 'hashed'
    ];

    public static array $rules = [
        'name' => 'required',
        'email' => 'email|required|unique:clients',
        'password' => 'confirmed|required'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

}
