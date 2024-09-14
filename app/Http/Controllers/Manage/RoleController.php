<?php

namespace App\Http\Controllers\Manage;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;
use App\Http\Resources\Manage\RoleResource;
use App\Http\Requests\Manage\Role\StoreRequest;
use App\Http\Requests\Manage\Role\UpdateRequest;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Manage/Role/Index', [
            'roles' => RoleResource::collection(Role::with('permissions:label,description')->get())
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Manage/Role/Create', [
            'permissions' => Permission::getPermissions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
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
