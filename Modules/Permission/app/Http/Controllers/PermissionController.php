<?php

namespace Modules\Permission\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Modules\Permission\Models\Permission;
use Modules\Permission\Http\Requests\StoreRequest;
use Modules\Permission\Http\Requests\UpdateRequest;

class PermissionController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permissions = Permission::all();
        return $this->success([
            'permissions' => $permissions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request): JsonResponse
    {
        $permission = DB::transaction(
            fn () =>
            Permission::create([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'model' => $request->input('model'),
                'action' => $request->input('action'),
            ])
        );

        return $this->success([
            'permission' => $permission,
        ]);
    }

    /**
     * Show the specified resource.
     */
    public function show($permission)
    {
        $permission = Permission::where('id', $permission)->first();
        if ($permission) {
            return $this->success([
                'permission' => $permission
            ]);
        } else {
            return $this->error('Permission not found', 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, $permission):JsonResponse
    {
        $permissionToUpdate = Permission::where('id', $permission)->first();

        if (!$permissionToUpdate) {
            return $this->error('Permission not found', 404);
        }

        DB::transaction(function () use ($request, $permissionToUpdate) {
            $permissionToUpdate->update([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'model' => $request->input('model'),
                'action' => $request->input('action')
            ]);
        });

        return $this->success([
            'permission' => $permissionToUpdate
        ]);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($permission)
    {
        $permissionToDelete = Permission::where('id', $permission)->first();
        if (!$permissionToDelete) {
            return $this->error('permission not found', 404);
        }

        DB::transaction(function () use ($permissionToDelete){
            $permissionToDelete->delete();
        });

        return $this->success([
            'message' => 'permission deleted succesfully'
        ]);
    }
}
