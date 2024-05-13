<?php

namespace Modules\ManageApp\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Modules\Permission\Models\Role;
use Modules\Permission\Models\Permission;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Request;
use Modules\ManageApp\Transformers\RoleResource;
use Modules\ManageApp\Http\Requests\Role\StoreRequest;
use Modules\Permission\Http\Requests\Role\UpdateRequest;

class RoleController extends Controller
{
    /** @var User */
    protected $user;

    public function __construct()
    {
        $this->user = Request::user();
    }

    public function index()
    {
        // Gate::authorize('role@read:*');
        return Inertia::render('Manage/Role/Index', [
            'roles' => RoleResource::collection(Role::getRoles())
        ]);
    }

    public function create()
    {
        return Inertia::render('Manage/Role/Create', [
            'permissions' => Permission::getPermissions(),

        ]);
    }

    public function store(StoreRequest $request)
    {
        // Gate::authorize('role@create');
        DB::transaction(function () use ($request) {
            $role = Role::create([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
            ]);

            $role->attachPermissions($request->input('permissions'));
        });

        return redirect(route('manage.role.index'))->with('alert', [
            'status' => 'success',
            'message' => 'Role created successfully'
        ]);
    }

    public function show(Role $role): JsonResponse
    {
        Gate::authorize("role@read:{$role->id}");
        return $this->success([
            'role' => $role
        ]);
    }

    public function edit(Role $role)
    {
        return Inertia::render('Manage/Role/Edit', [
            'permissions' => Permission::getPermissions(),
            'role' => [
                ...$role->only('id', 'name', 'description'),
                'permissionIds' => $role->permissions->pluck('id'),
            ]
        ]);
    }

    public function update(UpdateRequest $request, Role $role)
    {
        // Gate::authorize("role@edit:{$role->id}");
        $role = DB::transaction(function () use ($request, $role) {
            $role->update([
                'name' => $request->input('name'),
                'description' => $request->input('description')
            ]);

            $role->attachPermissions($request->input('permissions'));
        });

        return redirect(route('manage.role.index'))->with('alert', [
            'status' => 'success',
            'message' => 'Role updated successfully',
        ]);
    }

    public function destroy(Role $role)
    {
        // Gate::authorize("role@delete:{$role->id}");

        if (!DB::transaction(fn () => $role->delete())) {
            return redirect()->back()->with('alert', [
                'status' => 'danger',
                'message' => "something went wrong"
            ]);
        }

        return redirect()->back()->with('alert', [
            'status' => 'success',
            'message' => 'Role supprimer avec succés',
        ]);
    }
}
