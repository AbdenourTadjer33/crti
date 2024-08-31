<?php

namespace App\Http\Controllers\Manage;

use App\Models\Unit;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\Manage\User\StoreRequest;
use App\Http\Resources\Manage\BoardResource;
use App\Http\Resources\Manage\UserResource as ManageUserResource;
use App\Models\Board;
use Illuminate\Support\Facades\Hash;

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
            'units' => Unit::with('divisions')->get(),
            'boards' => BoardResource::collection(Board::all()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        /** @var User */

        DB::transaction(function () use ($request) {
            $user = User::create([
                'last_name' => $request->input('last_name'),
                'first_name' => $request->input('first_name'),
                'email' => $request->input('email'),
                'status' => $request->input('status'),
                'password' => $request->input('password'),
                'dob' => $request->input('dob'),
                'sex' => $request->input('sex'),
                'password' => Hash::make($request->input('password')),
                'status' => $request->input('status'),
                'unit_id' => $request->input('unit_id')
            ]);

            if (isset($validated['divisions'])) {
                $divisions = collect($validated['divisions'])->mapWithKeys(function ($division) {
                    return [$division['id'] => $division['grade'] ?? null];
                });

                $pivotData = $divisions->mapWithKeys(function ($grade, $divisionId) {
                    return [$divisionId => ['grade' => $grade]];
                });

                $user->divisions()->attach($pivotData);
            }

            if ($request->has('boards')) {
                $boards = $request->input('boards');
                $user->boards()->attach($boards);
            }
        });

        return redirect(route('manage.user.index'))->with('alert', [
            'status' => 'success',
            'message' => 'Utilisateur avec succés'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load('divisions');
        return Inertia::render('Manage/User/Show',[
            'user' => new ManageUserResource($user),
        ]);
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
