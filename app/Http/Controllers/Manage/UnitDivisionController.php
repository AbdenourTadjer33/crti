<?php

namespace App\Http\Controllers\Manage;

use App\Models\Unit;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Division;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\Manage\DivisionResource;
use App\Http\Requests\Manage\Division\StoreDivisionRequest;
use App\Http\Requests\Manage\Division\UpdateDivisionRequest;
use App\Http\Resources\Manage\UnitResource;

class UnitDivisionController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(Unit $unit)
    {

        return Inertia::render('Manage/Unit/Division/Create', [
            "unit" => $unit,
            'grades' => DB::table('division_grades')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDivisionRequest $request, Unit $unit)
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
            'status' => 'succes',
            'message' => 'Division créer avec succes'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Unit $unit, Division $division)
    {
        return Inertia::render('Manage/Unit/Division/Show', [
            'unit' => new UnitResource($unit->load('divisions')),
            'division' => new DivisionResource($division->load(['users'])),
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
    public function update(UpdateDivisionRequest $request, Unit $unit, Division $division)
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
            'status' => 'succes',
            'message' => 'Division mise a jour avec succes'
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
}
