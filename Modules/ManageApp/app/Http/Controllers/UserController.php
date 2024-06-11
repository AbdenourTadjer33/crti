<?php

namespace Modules\ManageApp\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Modules\Permission\Models\Permission;
use Modules\ManageApp\Transformers\UserResource;
use Modules\ManageApp\Http\Requests\User\StoreRequest;
use Modules\ManageApp\Models\Diploma;
use Modules\ManageApp\Models\Grades;
use Modules\ManageApp\Models\University;
use Modules\Unit\Models\Unit;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Gate::authorize('user@read:*');

        $users = UserResource::collection(
            User::paginate()
        );

        return Inertia::render('Manage/User/Index', [
            'users' => $users
        ]);
    }

    public function create()
    {
        return Inertia::render('Manage/User/Create', [
            'permissions' => Permission::getPermissions(),
            'roles' => Role::getRoles(),
            'universities' => Cache::remember('universities', now()->addMinutes(10), fn () => University::get()),
            // 'grades' => Grades::get(),
            'diplomes' => Diploma::get(),
            'units' => Unit::get(['id', 'name'])
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
        return new UserResource($user);
        // Gate::authorize("user@read:{$user->id}");
        // return $this->success(
        //     $user->loadPermissions()->loadRoles(),
        // );
    }

    public function search(Request $request)
    {
        if (app()->isProduction() && !$request->isXmlHttpRequest()) {
            abort(401);
        }

        if (!$request->input('query')) {
            return abort(404);
        }

        return User::search($request->input('query'))->simplePaginateRaw()->items();
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
