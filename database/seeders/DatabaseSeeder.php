<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Test;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Modules\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'first_name' => 'reda',
            'last_name' => 'ben',
            'email' => 'reda@ben.com',
            'password' => bcrypt('password'),
            'status' => true,
        ]);
    }
}
