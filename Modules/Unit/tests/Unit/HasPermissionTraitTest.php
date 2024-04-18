<?php

namespace Modules\Permission\tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Modules\Permission\Models\Role;
use Modules\Permission\Models\Permission;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class HasPermissionTraitTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_attach_permissions_to_user()
    {
        $user = User::factory()->create();

        $permission1 = Permission::factory()->create();
        $permission2 = Permission::factory()->create();

        $this->assertTrue($user->attachPermissions($permission1->id, $permission2->id));

        $this->assertTrue($user->hasDirectPermissions($permission1->id, $permission2->id));
    }

    public function test_it_can_attach_permissions_to_role()
    {
        $role = Role::factory()->create();

        $permission1 = Permission::factory()->create();
        $permission2 = Permission::factory()->create();

        $role->attachPermissions($permission1->id, $permission2->id);
        $this->assertTrue($role->hasPermissions($permission1->id, $permission2->id));
    }

    public function test_it_can_revoke_permissions_from_user()
    {
        $user = User::factory()->create();

        $permission1 = Permission::factory()->create();
        $permission2 = Permission::factory()->create();

        $user->attachPermissions($permission1->id, $permission2->id);
        $this->assertTrue($user->revokePermissions($permission1->id, $permission2->id));
    }

    public function test_it_can_revoke_permissions_from_role()
    {
        $role = Role::factory()->create();

        $permission1 = Permission::factory()->create();
        $permission2 = Permission::factory()->create();

        $role->attachPermissions($permission1->id, $permission2->id);
        $this->assertTrue($role->revokePermissions($permission1->id, $permission2->id));
    }
}
