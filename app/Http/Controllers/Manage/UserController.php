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
use App\Models\Division;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userDivisionsFn = function () use ($request) {
            $user = User::query()->where('uuid', $request->input('uuid'))->first();

            // $userDivisions = $user->divisions()->get(['id', 'name', 'abbr']);
            $userDivisions = $user->divisions()->get(['id', 'name', 'abbr', 'division_grade_id']);


            $userDivisions->map(fn ($division) => [
                'id' => (string )$division->id,
                'name' => $division->name,
                'abbr' => $division->abbr,
            ] );

            return $userDivisions;



            return [

                'userDivisions' => $userDivisions,
                // 'divisions' => $divisions,
            ];
        };

        return $userDivisionsFn();

        return Inertia::render('Manage/User/Index', [
            'users' => fn () => ManageUserResource::collection(User::active()->latest('updated_at')->paginate() ),
            'new_users' => fn () => ManageUserResource::collection(User::newUser()->get()),
            'userDivisions' => Inertia::lazy($userDivisionsFn),
            'divisions' => Inertia::lazy(fn() => Division::with('unit:id,name,abbr')->get()),

        ]);


    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('Manage/User/Create', [
            'units' => Unit::get(),
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        /** @var User */
        DB::transaction(function () use ($request) {
            User::create([
                'last_name' => $request->input('last_name'),
                'first_name' => $request->input('first_name'),
                'email' => $request->input('email'),
                'password' => $request->input('password'),
                'dob' => $request->input('dob'),
                'sex' => $request->input('sex'),
                'status' => $request->input('status'),
                'unit_id' => $request->input('unit_id')
            ]);
        });

        return redirect(route('manage.user.index'))->with('alert', [
            'status' => 'success',
            'message' => 'Utilisateur créer avec succés'
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
        DB::transaction(function () use ($user) {
            $user->delete();
        });
        return redirect()->route('manage.user.index')->with('alert', [
            'status' => 'success',
            'message' => 'Utilisateur supprimé avec succès.'
        ]);
    }

    public function accept(User $user)
    {
        DB::transaction(function () use ($user) {
            $user->update([
                'status' => true,
            ]);
        });

        return redirect()->route('manage.user.index')->with('alert', [
            'status' => 'success',
            'message' => 'Utilisateur approuvé avec succès'
        ]);
    }
}
