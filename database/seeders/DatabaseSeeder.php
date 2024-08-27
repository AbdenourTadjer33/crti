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
        if (!User::query()->where('email', 'red.ben@gmail.com')->count()) {
            User::create([
                'first_name' => 'Reda',
                'last_name' => 'Benabbas',
                'email' => 'red.ben@gmail.com',
                'password' => bcrypt('password'),
                'status' => true,
            ]);
        }

        $this->call([
            InitAppSeeder::class
        ]);
    }
}
