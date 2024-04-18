<?php

namespace Modules\Unit\database\seeders;

use Illuminate\Database\Seeder;
use Modules\Permission\Models\Permission;

class UnitDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::factory(10)->create();
    }
}
