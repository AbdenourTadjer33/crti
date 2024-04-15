<?php

namespace Modules\Permission\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Modules\Permission\Models\Permission;
use Modules\Permission\Http\Requests\Permission\StoreRequest;
use Modules\Permission\Http\Requests\Permission\UpdateRequest;


class PermissionController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return $this->success([
            'permissions' => Permission::getPermissions(),
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
    public function show(Permission $permission)
    {
        return $this->success([
            'permission' => $permission
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Permission $permission): JsonResponse
    {
        $permission = DB::transaction(
            fn () =>
            $permission->update([
                'model' => $request->input('model') ?: $permission->model,
                'action' => $request->input('action') ?: $permission->action,
            ])
        );

        return $this->success(message: 'permission updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        if (!DB::transaction(fn () => $permission->delete())) {
            return $this->error(code: 500, message: "something went wrong");
        }
        
        return $this->success(message: 'permission deleted successfully');
    }
}
