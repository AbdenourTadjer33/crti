<?php

namespace App\Http\Controllers\Manage;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use App\Http\Resources\Manage\RoleResource;
use App\Http\Requests\Manage\Role\StoreRequest;
use App\Http\Requests\Manage\Role\UpdateRequest;
use App\Services\Permission\PermissionService;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return Inertia::render('Manage/Role/Index', [
            'roles' => fn() => RoleResource::collection(Role::withCount('users')->with('permissions:id,name,default')->paginate(15)),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(PermissionService $permissionService)
    {
        return Inertia::render('Manage/Role/Create', [
            // 'permissions' => $permissions
            'defaultParams' => $permissionService->getParams(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request, PermissionService $permissionService)
    {
        DB::transaction(function () use ($request, $permissionService) {
            $role = Role::create([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
            ]);

            $permissions = $permissionService->getPermissionsFromParams(
                $request->input('default', []),
                Permission::getPermissions()->where('default', true)
            );

            $role->givePermissionTo($permissions);
        });

        return redirect(route('manage.role.index'))->with('alert', [
            'status' => 'success',
            'message' => 'Role créer avec succés'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show() {}

    /**
     * Show the form for editing the specified resource.
     */
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

            $role->attachPermissions($request->input('permissions'));
        });

        return redirect(route('manage.role.index'))->with('alert', [
            'status' => 'success',
            'message' => 'Role updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        if (!DB::transaction(fn() => $role->delete())) {
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


// $params = [];

// foreach ($permissions as $permission) {
//     $name = $permission->name;

//     // Split the permission name by dot (.)
//     $parts = explode('.', $name);

//     // If it has both feature and action
//     if (count($parts) == 2) {
//         $feature = $parts[0];
//         $action = $parts[1];

//         // If the feature already exists in the array, append the action
//         if (isset($params[$feature])) {
//             $params[$feature][] = $action;
//         } else {
//             // Otherwise, create a new entry with the feature and action
//             $params[$feature] = [$action];
//         }
//     } else {
//         // If no dot is found, treat the entire string as the feature with no actions
//         $feature = $name;
//         if (!isset($params[$feature])) {
//             $params[$feature] = [];
//         }
//     }
// }
