<?php

namespace App\Http\Controllers\Manage;

use App\Models\Unit;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Modules\Permission\Models\Permission;
use App\Http\Resources\Manage\UserResource as ManageUserResource;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = ManageUserResource::collection(
            User::paginate()
        );

        return Inertia::render('Manage/User/Index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Manage/User/Create', [
            'permissions' => Permission::getPermissions(),
            'roles' => Role::getRoles(),
            // 'universities' => Cache::remember('universities', now()->addMinutes(10), fn () => University::get()),
            // 'grades' => Grades::get(),
            // 'diplomes' => Diploma::get(),
            'universities' => [],
            'grades' => [],
            'diplomes' => [],
            'units' => Unit::get(['id', 'name'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'status' => $request->input('status'),
                'password' => $request->input('password'),
            ]);
        });

    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return new ManageUserResource($user);
    }

    /**
     * Search for users by query
     */
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
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
