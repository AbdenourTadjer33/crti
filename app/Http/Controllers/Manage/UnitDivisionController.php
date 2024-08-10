<?php

namespace App\Http\Controllers\Manage;

use App\Models\Unit;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Division;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\Manage\DivisionResource;
use App\Http\Requests\Manage\Division\StoreDivisionRequest;
use App\Http\Requests\Manage\Division\UpdateDivisionRequest;
use App\Http\Resources\Manage\UnitResource;
use App\Http\Resources\UserDivisionsResource;

class UnitDivisionController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(Unit $unit)
    {
        return Inertia::render('Manage/Unit/Division/Create', [
            "unit" => $unit,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDivisionRequest $request, Unit $unit)
    {
        /** @var Division */
        $division = $unit->divisions()->create([
            'name' => $request->input('name'),
            'abbr' => $request->input('abbr'),
            'description' => $request->input('description'),
        ]);

        $members = collect($request->members)->mapWithKeys(function ($member) {
            return [$member['uuid'] => $member['grade'] ?? null];
        });

        $users = User::withTrashed()->whereIn('uuid', $members->keys())->get(['id', 'uuid']);

        $pivotData = $users->mapWithKeys(function ($user) use ($members) {
            return [$user->id => ['grade' => $members[$user->uuid]]];
        });

        $division->users()->attach($pivotData);

        return redirect()->route('manage.unit.division.show', [
            'unit' => $unit->id,
            'division' => $division->id])->with('alert', [
            'status' => 'succes',
            'message' => 'Division mise a jour avec succes'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Unit $unit, Division $division)
    {
        return Inertia::render('Manage/Unit/Division/Show', [
            'unit' => new UnitResource($unit->load('divisions')),
            'division' => new DivisionResource($division->load('users')),
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Unit $unit, Division $division)
    {
        $division->load('users');
        return Inertia::render('Manage/Unit/Division/Edit', [
            'unit' => $unit,
            'division' => $division,
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
                'description' => $request->input('description')
            ]);

            $members = collect($request->input('members', []))->mapWithKeys(function ($member) {
                return [$member['uuid'] => $member['grade'] ?? null];
            });

            $users = User::withTrashed()->whereIn('uuid', $members->keys())->get(['id', 'uuid']);

            $pivotData = $users->mapWithKeys(function ($user) use ($members) {
                return [$user->id => ['grade' => $members[$user->uuid]]];
            });

            $division->users()->sync($pivotData);
        });
        return redirect()->route('manage.unit.division.show', [
            'unit' => $unit->id,
            'division' => $division->id])->with('alert', [
            'status' => 'succes',
            'message' => 'Division mise a jour avec succes'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit, Division $division)
    {
        DB::transaction(function () use ($division) {
            $division->users()->detach();

            $division->delete();
        });

        return redirect()->route('manage.unit.division.index', [
            'unit' => $unit,
        ])->with('alert', [
            'status' => 'success',
            'message' => 'Division supprimée avec succès.'
        ]);
    }
}
