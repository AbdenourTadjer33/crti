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

class UnitDivisionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Unit $unit)
    {
        return Inertia::render('Manage/Unit/Division/Index', [
            "unit" => fn () => $unit,
            'divisions' => fn () => DivisionResource::collection($unit->divisions()->paginate()),
        ]);
    }

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

        // dd($request->all());

        /** @var Division */
        $division = $unit->divisions()->create([
            'name' => $request->input('name'),
            'abbr' => $request->input('abbr'),
            'description' => $request->input('description'),
        ]);
        // $members = User::withTrashed()->whereIn('uuid', collect($request->members)->map(fn ($member) => $member['uuid']))->get(['id', 'uuid']);
        // $division->users()->attach();

            $members = collect($request->members)->mapWithKeys(function ($member) {
                return [$member['uuid'] => $member['grade'] ?? null];
            });

            $users = User::withTrashed()->whereIn('uuid', $members->keys())->get(['id', 'uuid']);

            $pivotData = $users->mapWithKeys(function ($user) use ($members) {
                return [$user->id => ['grade' => $members[$user->uuid]]];
            });

            $division->users()->attach($pivotData);

        return redirect()->route('manage.unit.index', $unit)->with('alert', [
            'status' => 'succes',
            'message' => 'Division mise a jour avec succes'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
        return redirect()->route('manage.unit.division.index', [
            'unit' => $unit->id,
        ])->with('alert', [
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
