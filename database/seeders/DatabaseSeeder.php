<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (!User::query()->where('email', 'tad.abdenour33@gmail.com')->count()) {
            User::create([
                'first_name' => 'Abdenour',
                'last_name' => 'Tadjer',
                'email' => 'tad.abdenour33@gmail.com',
                'password' => bcrypt('password'),
                'status' => true,
            ]);
        }

        $this->call([
            InitAppSeeder::class
        ]);
    }
}
