<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class InitAppSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('natures')->insert(Storage::json('data/project_natures.json'));
        DB::table('domains')->insert(Storage::json('data/project_domains.json'));
        DB::table('universities')->insert(Storage::json('data/universities.json'));
        DB::table('diplomas')->insert(Storage::json('data/diplomas.json'));
        DB::table('division_grades')->insert(Storage::json('data/division_grades.json'));

        $unit = Unit::query()->create([
            'name' => 'Centre de Recherche en Technologies Industrielles',
            'abbr' => 'CRTI',
            'web_page' => 'https://crti.dz/',
            'description' => null,
            'address' => 'CRTI P.O.Box 64, Cheraga 16014 Alger, Algerie',
        ]);

        $unit->divisions()->createMany(Storage::json('data/divisions.json'));
        $unit->users()->createMany(Storage::json('data/users.json'));

        User::query()->first()->divisions()->attach(Division::all()->random()->id);
    }
}
