<?php

namespace Modules\Permission\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Modules\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Modules\Permission\Http\Requests\Role\StoreRequest;
use Modules\Permission\Http\Requests\Role\UpdateRequest;

class RoleController extends Controller
{
    public function index(): JsonResponse
    {
        return $this->success([
            'roles' => Role::getRoles(),
        ]);
    }

    public function store(StoreRequest $request): JsonResponse
    {        
        $role = DB::transaction(function () use ($request) {
            $role = Role::create([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
            ]);

            $role->givePermissionsTo($request->input('permissions'));
            return $role->loadPermissions();
        });

        return $this->success([
            'role' => $role,
        ]);
    }

    public function show(Role $role): JsonResponse
    {
        return $this->success([
            'role' => $role
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Role $role)
    {
        $role = DB::transaction(function () use ($request, $role) {
            $role->update([
                'name' => $request->input('name'),
                'description' => $request->input('description')
            ]);
            return $role;
        });

        return $this->success(message: 'role updated successfully');
    }

    public function destroy(Role $role)
    {
        if (!DB::transaction(fn () => $role->delete())) {
            return $this->error(code: 500, message: 'something went wrong');
        }

        return $this->success(message: 'permission deleted successfully');
    }
}
