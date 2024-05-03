<?php

namespace Modules\ManageApp\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Request;
use Modules\Permission\Models\Permission;
use Modules\Permission\Enums\PermissionType;
use Modules\Permission\Http\Requests\Permission\StoreRequest;
use Modules\Permission\Http\Requests\Permission\UpdateRequest;


class PermissionController extends Controller
{
    /** @var User */
    protected $user;

    public function __construct()
    {
        $this->user = Request::user();
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        // Gate::authorize('permission@read:*');
        return $this->success([
            'permissions' => Permission::getPermissions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request): JsonResponse
    {
        Gate::authorize('permission@create');
        $permission = DB::transaction(function () use ($request) {
            $permission = Permission::create([
                'model' => $request->input('model'),
                'action' => $request->input('action'),
                'type' => (int) $request->input('type'),
                'contexts' => (int) $request->input('type') === PermissionType::Context->value ? $request->input('contexts') : null
            ]);

            return $permission;
        });

        return $this->success([
            'permission' => $permission,
        ]);
    }

    /**
     * Show the specified resource.
     */
    public function show(Permission $permission)
    {
        Gate::authorize("permission@read:{$permission->id}");
        return $this->success([
            'permission' => $permission
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Permission $permission): JsonResponse
    {
        Gate::authorize("permission@edit:{$permission->id}");
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
        Gate::authorize("permission@delete:{$permission->id}");
        if (!DB::transaction(fn () => $permission->delete())) {
            return $this->error(code: 500, message: "something went wrong");
        }

        return $this->success(message: 'permission deleted successfully');
    }
}
