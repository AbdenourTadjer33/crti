<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Cache::flush();

        $params = Storage::json('data/permission/params.json');
        $permissions = [];

        foreach ($params as $feature => $actions) {
            if (count($actions) === 1) {
                $permissions[] = "{$feature}.{$actions[0]}";
            } else {
                $permissions[] = $feature;
                foreach ($actions as $action) {
                    $permissions[] = $feature . "." . $action;
                }
            }
        }

        foreach ($permissions as $permission) {
            Permission::create(["name" => $permission, "default" => true]);
        }

        /** @var Role */
        $role = Role::create([
            'name' => 'admin',
            'description' => "Le rôle d'Admin offre un contrôle total sur l'application, y compris la gestion des utilisateurs, des permissions et des paramètres globaux. Les administrateurs ont l'autorité de superviser et de maintenir le système",
        ]);

        $role->givePermissionTo(Permission::get());
    }
}
