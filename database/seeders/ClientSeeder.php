<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Client::query()->create([
            'name' => 'User',
            'email' => 'user@ethar.com',
            'password' => bcrypt('password'),
        ]);
    }
}
