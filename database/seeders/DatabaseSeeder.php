<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (!\App\Models\User::query()->where('email', 'tad.abdenour33@gmail.com')->count()) {
            \App\Models\User::create([
                'first_name' => 'abdenour',
                'last_name' => 'tadjer',
                'email' => 'tad.abdenour33@gmail.com',
                'password' => bcrypt('password'),
                'status' => true,
            ]);
        }

        $this->call([
            PermissionSeeder::class,
            InitAppSeeder::class
        ]);
    }
}
