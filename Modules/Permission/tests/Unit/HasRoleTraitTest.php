<?php

namespace Modules\Permission\Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Modules\Permission\Models\Role;
use Modules\Permission\Models\Permission;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class HasRoleTraitTest extends TestCase
{
	use RefreshDatabase;

	public function test_it_can_attach_role_to_users()
	{
		$user = User::factory()->create();
		$role = Role::factory()->create();
		$permissions = Permission::factory(10)->create();

		$role->attachPermissions($permissions);
		$this->assertTrue($user->attachRole($role));
	}

	public function test_it_can_revoke_permissions_from_role()
	{
		$role = Role::factory()->create();
		$permissions = Permission::factory(10)->create();

		$role->attachPermissions($permissions);

		$role->revokePermissions($permissions);
		$this->assertTrue(!$role->hasPermissions($permissions));
	}

	public function test_it_can_check_if_role_has_permissions()
	{}

	public function test_it_can_check_role_dont_have_permissions()
	{}

	public function test_it_can_revoke_role_from_users()
	{}

	public function test_it_can_clear_role_from_permissions_and_assign_those_permissions_to_user()
	{}
}
