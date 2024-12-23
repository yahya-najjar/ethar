<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->create([
            'name' => 'Admin User',
            'email' => 'admin@ethar.com',
            'password' => bcrypt('password'),
        ]);

        $this->call(CategorySeeder::class);
        $this->call(ProgramsSeeder::class);
        $this->call(CharitySeeder::class);
        $this->call(CampaignSeeder::class);
        $this->call(ClientSeeder::class);

    }
}
