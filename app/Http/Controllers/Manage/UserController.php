<?php

namespace App\Http\Controllers\Manage;

use App\Models\Unit;
use App\Models\User;
use Inertia\Inertia;
use App\Events\GreetingMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Permission;
use App\Http\Resources\UserDivisionsResource;
use App\Http\Requests\Manage\User\StoreRequest;
use App\Http\Requests\Manage\User\SyncAccessRequest;
use App\Http\Requests\Manage\User\SyncDivisionsRequest;
use App\Http\Resources\Manage\Permission\DefaultRoleResource;
use App\Http\Resources\Manage\UserResource as ManageUserResource;
use App\Http\Resources\Manage\Permission\DefaultPermissionResource;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $usersFn = function () use ($request) {
            if ($request->input('query')) {

                $users = User::search($request->input('query'))->paginate(15, 'search-page');
            } else {
                $users = User::active()->latest('updated_at')->paginate();
            }

            return ManageUserResource::collection($users);
        };

        $userDivisionsFn = function () use ($request) {
            $user = User::query()->where('uuid', $request->input('uuid', ''))->first();

            if (!$user) return;

            $userDivisions = $user->divisions()->get(['id', 'name', 'abbr', 'division_grade_id']);

            return UserDivisionsResource::collection($userDivisions);
        };

        $userAccessFn = function () use ($request) {
            $user = User::query()->where('uuid', $request->input('uuid', ''))->first();

            if (!$user) return;

            return [
                'permissions' => $user->permissions,
                'roles' => $user->roles,
            ];
        };

        return Inertia::render('Manage/User/Index', [
            'users' => $usersFn,
            'newUsers' => fn() => ManageUserResource::collection(User::newUsers()->get()),
            'userDivisions' => Inertia::lazy($userDivisionsFn),
            'unitsDivision' => Inertia::lazy(fn() => Unit::with('divisions:id,unit_id,name,abbr')->get()),
            'grades' => Inertia::lazy(fn() => Cache::remember('division_grades', now()->addHour(), fn() => DB::table('division_grades')->get(['id', 'name']))),
            'userAccess' => Inertia::lazy($userAccessFn),
            'permissions' => Inertia::lazy(fn() => DefaultPermissionResource::collection(Permission::getPermissions())),
            'roles' =>  Inertia::lazy(fn() => DefaultRoleResource::collection(Role::get(['id', 'name']))),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Manage/User/Create', [
            'diplomas' => fn() => Cache::remember('diplomas', now()->addDay(), fn() => DB::table('diplomas')->get(['id', 'name'])->map(fn($d) => ['id' => (string) $d->id, 'name' => $d->name])),
            'universities' => fn() => Cache::remember('universities', now()->addDay(), fn() => DB::table('universities')->get(['id', 'name'])->map(fn($u) => ['id' => (string) $u->id, 'name' => $u->name])),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        DB::transaction(function () use ($request) {
            $user = User::query()->create([
                'status' => true,
                'first_name' => $request->input('firstName'),
                'last_name' => $request->input('lastName'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
                'dob' => $request->input('dob'),
                'sex' => $request->input('sex'),
                'title' => $request->input('title'),
            ]);

            $user->markEmailAsVerified();

            if ($request->input('academicQualification', [])) {

                $academicInformations = [];

                for ($i = 0; $i < count($request->input('academicQualification')); $i++) {
                    $academicInformations[] = [
                        'university' => $request->input("academicQualification.{$i}.university"),
                        'diploma' => $request->input("academicQualification.{$i}.diploma"),
                        'graduation_date' => $request->input("academicQualification.{$i}.graduationDate")
                    ];
                }

                $user->academicQualifications()->createMany($academicInformations);
            }

            if ($request->input('accessPermission')) {
                $user->givePermissionTo('application.access');
            }

            if ($request->input('greetingEmail') && $request->input('accessPermission')) {
                event(new GreetingMail($user->id, $request->input('password')));
            }
        });

        return redirect(route('manage.user.index'))->with('alert', [
            'status' => 'success',
            'message' => 'Utilisateur créer avec succés'
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('Manage/User/Edit', [
            'user' => fn() => $user->load('academicQualifications'),
            'diplomas' => fn() => Cache::remember('diplomas', now()->addDay(), fn() => DB::table('diplomas')->get(['id', 'name'])->map(fn($d) => ['id' => (string) $d->id, 'name' => $d->name])),
            'universities' => fn() => Cache::remember('universities', now()->addDay(), fn() => DB::table('universities')->get(['id', 'name'])->map(fn($u) => ['id' => (string) $u->id, 'name' => $u->name])),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        DB::transaction(function () use ($request, $user) {
            $user->update([
                'first_name' => $request->input('firstName'),
                'last_name' => $request->input('lastName'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
                'dob' => $request->input('dob'),
                'sex' => $request->input('sex'),
                'title' => $request->input('title'),
            ]);

            return redirect(route('manage.user.index'))->with('alert', [
                'status' => 'success',
                'message' => 'Utilisateur modifier avec succés'
            ]);
        });
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

    public function syncAccess(SyncAccessRequest $request, User $user)
    {
        DB::transaction(function () use ($request, $user) {
            $user->roles()->sync($request->input('permissions'));
            $user->permissions()->sync($request->input('roles'));
        });

        return back()->with('alert', [
            'status' => 'success',
            'message' => 'Roles et permissions mis à jour avec succés',
        ]);
    }

    public function syncDivisions(SyncDivisionsRequest $request, User $user)
    {
        DB::transaction(function () use ($request, $user) {
            $pivot = [];

            for ($i = 0; $i < count($request->input('divisions', [])); $i++) {
                $pivot[$request->input("divisions.{$i}.division")] = ["division_grade_id" => $request->input("divisions.{$i}.grade")];
            }
            $user->divisions()->sync($pivot);
        });

        return back();
    }
}
