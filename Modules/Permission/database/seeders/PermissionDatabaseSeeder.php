<?php

namespace Modules\Permission\database\seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Modules\Permission\Models\Role;
use Illuminate\Support\Facades\Cache;
use Modules\Permission\Models\Permission;
use Modules\Permission\PermissionRegistrar;

class PermissionDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (PermissionRegistrar::getUsePermissionModels() as $model) {
            $permissions = [];
            foreach ($model['actions'] as $action) {
                $permissions[] = [
                    'model' => $model['label'],
                    'action' => $action,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            DB::table(config('permission.table_names.permissions'))->insert($permissions);
        }

        $role = Role::create([
            'name' => 'admin',
            'description' => 'The admin role grants privileged access and control over system settings and management functions.'
        ]);

        $role->attachAllPermissions();

        Cache::flush();
    }
}
