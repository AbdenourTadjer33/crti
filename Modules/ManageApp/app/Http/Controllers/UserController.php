<?php

namespace Modules\ManageApp\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Modules\Client\Http\Requests\User\StoreRequest;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Gate::authorize('user@read:*');
        return Inertia::render('User/Index', [
            "users" => User::with(['permissions', 'roles'])->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        Gate::authorize('user@create');

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'status' => $request->input('status'),
                'password' => $request->input('password'),
            ]);
        });

        return response()->json([]);
    }

    /**
     * Show the specified resource.
     */
    public function show(User $user)
    {
        Gate::authorize("user@read:{$user->id}");
        // return $this->success(
        //     $user->loadPermissions()->loadRoles(),
        // );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        Gate::authorize("user@update:{$user->id}");

        return response()->json([]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        Gate::authorize("user@delete:{$user->id}");

        return response()->json([]);
    }
}
