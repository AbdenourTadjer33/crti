<?php

namespace App\Http\Controllers\Manage;

use App\Models\Unit;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Division;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use App\Http\Resources\Manage\DivisionResource;
use App\Http\Requests\Manage\Division\StoreRequest;
use App\Http\Requests\Manage\Division\UpdateRequest;
use App\Http\Requests\Manage\Division\AttachUsersRequest;

class UnitDivisionController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(Unit $unit)
    {
        return Inertia::render('Manage/Unit/Division/Create', [
            "unit" => fn() => $unit->only('id', 'name', 'abbr'),
            'grades' => fn() => Cache::remember('division_grades', now()->addHour(), fn() => DB::table('division_grades')->get(['id', 'name'])),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request, Unit $unit)
    {
        $division = DB::transaction(function () use ($request, $unit) {
            /** @var Division */
            $division = $unit->divisions()->create([
                'name' => $request->input('name'),
                'abbr' => $request->input('abbr'),
                'description' => $request->input('description'),
                'webpage' => $request->input('webpage'),
            ]);

            $members = collect($request->input('members', []))->mapWithKeys(function ($member) {
                return [$member['uuid'] => ["division_grade_id" => $member['grade']]];
            });

            $users = User::whereIn('uuid', $members->keys())->get(['id', 'uuid']);

            $pivotData = $users->mapWithKeys(function ($user) use ($members) {
                return [$user->id =>  $members[$user->uuid]];
            });

            $division->users()->attach($pivotData);

            return $division;
        });

        return redirect()->route('manage.unit.division.show', [
            'unit' => $unit->id,
            'division' => $division->id
        ])->with('alert', [
            'status' => 'success',
            'message' => 'Division créer avec succés'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Unit $unit, Division $division)
    {
        $gradesFn = function () {
            return Cache::remember(
                'division_grades',
                now()->addHour(),
                fn() => DB::table('division_grades')->get(['id', 'name'])
            );
        };

        return Inertia::render('Manage/Unit/Division/Show', [
            'unit' => fn() => $unit->only('id', 'name', 'abbr'),
            'division' => new DivisionResource($division->load('users')),
            'grades' => Inertia::lazy($gradesFn),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Unit $unit, Division $division)
    {
        return Inertia::render('Manage/Unit/Division/Edit', [
            'unit' => $unit,
            'division' => $division->load('users'),
            'grades' => DB::table('division_grades')->get(['id', 'name']),

        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Unit $unit, Division $division)
    {
        DB::transaction(function () use ($request, $division) {
            $division->update([
                'name' => $request->input('name'),
                'abbr' => $request->input('abbr'),
                'description' => $request->input('description'),
                'webpage' => $request->input('webpage')
            ]);

            $members = collect($request->input('members', []))->mapWithKeys(function ($member) {
                return [$member['uuid'] => ["division_grade_id" => $member['grade']]];
            });

            $users = User::whereIn('uuid', $members->keys())->get(['id', 'uuid']);

            $pivotData = $users->mapWithKeys(function ($user) use ($members) {
                return [$user->id => $members[$user->uuid]];
            });

            $division->users()->sync($pivotData);
        });

        return redirect()->route('manage.unit.division.show', [
            'unit' => $unit->id,
            'division' => $division->id
        ])->with('alert', [
            'status' => 'success',
            'message' => 'Division mise a jour avec succés'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($unit, Division $division)
    {
        DB::transaction(function () use ($division) {
            $division->users()->detach();
            $division->delete();
        });

        return redirect()->route('manage.unit.show', [
            'unit' => $unit,
        ])->with('alert', [
            'status' => 'success',
            'message' => 'Division supprimée avec succès.'
        ]);
    }

    public function attachUsers(AttachUsersRequest $request, $unit, Division $division)
    {
        DB::transaction(function () use ($request, $division) {
            $members = collect($request->input('users', []))->mapWithKeys(function ($member) {
                return [$member['uuid'] => ["division_grade_id" => $member['grade']]];
            });

            $users = User::whereIn('uuid', $members->keys())->get(['id', 'uuid']);

            $pivotData = $users->mapWithKeys(function ($user) use ($members) {
                return [$user->id =>  $members[$user->uuid]];
            });

            $division->users()->attach($pivotData);

            return $division;
        });

        return back()->with('alert', [
            'status' => 'success',
            'message' => 'Utilisateur ajouter à la division avec sucéés',
        ]);
    }

    public function detachUsers(Request $request, $unit, Division $division)
    {
        $request->validate([
            'uuid' => ['required', 'uuid'],
        ]);

        $division->users()
            ->detach($division->users()->where('uuid', $request->input('uuid'))->first(['id', 'uuid'])->id);

        return back()->with('alert', [
            'status' => 'success',
            'message' => "Utilisateur détache de la division {$division->name} avec succés",
        ]);
    }

    public function editGrade(Request $request, $unit, Division $division, User $user)
    {
        $request->validate(['grade' => ['required']]);

        DB::transaction(function () use ($user, $division, $request) {
            $division->users()->sync([$user->id =>  ['division_grade_id' => $request->input('grade')]], false);
        });

        return back()->with('alert', [
            'status' => 'success',
            'message' => "Le grade de {$user->first_name} {$user->last_name} est mis à jour avec succés."
        ]);
    }
}
