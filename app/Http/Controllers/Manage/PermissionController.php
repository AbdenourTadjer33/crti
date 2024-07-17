<?php

namespace App\Http\Controllers\Manage;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Modules\Permission\Models\Permission;
use App\Http\Resources\Manage\PermissionResource;
use App\Http\Requests\Manage\Permission\StoreRequest;
use App\Http\Requests\Manage\Permission\UpdateRequest;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Manage/Permission/Index', [
            'permissions' => PermissionResource::collection(Permission::getPermissions()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Manage/Permission/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $permission = DB::transaction(function () use ($request) {
            $permission = Permission::create([
                'model' => $request->input('model'),
                'action' => $request->input('action'),
                'type' => (int) $request->input('type'),
            ]);

            return $permission;
        });

    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission)
    {
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Permission $permission)
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
            return redirect()->back()->with('alert', [
                'status' => 'danger',
                'message' => "something went wrong"
            ]);
        }

        return redirect()->back()->with('alert', [
            'status' => 'success',
            'message' => 'Permission supprimer avec succés',
        ]);
    }
}
