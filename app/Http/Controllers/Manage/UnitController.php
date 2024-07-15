<?php

namespace App\Http\Controllers\Manage;

use App\Models\Unit;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\Manage\Unit\StoreRequest;
use App\Http\Requests\Manage\Unit\UpdateRequest;
use App\Http\Resources\Manage\UnitResource;
use App\Http\Resources\Manage\UserResource as ManageUserResource;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Manage/Unit/Index', [
            'units' => UnitResource::collection(Unit::with('divisions')->paginate(15)),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Manage/Unit/Create', [
            'users' => ManageUserResource::collection(User::paginate(10))
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        DB::transaction(function () use ($request) {
            /** @var Unit */
            $unit = Unit::create([
                'name' => $request->input('name'),
                'abbr' => $request->input('abbr'),
                'description' => $request->input('description'),
                'address' => $request->input('address'),
                'city' => $request->input('city'),
                'country' => $request->input('country'),
            ]);

            foreach ($request->input('divisions', []) as $division) {
                /** @var Division */
                $divisionModel = $unit->divisions()->create(
                    collect($division)
                        ->only('name', 'abbr', 'description')
                        ->toArray()
                );

                $members = collect($division['members'])->map(function ($member) {
                    return [
                        'user_id' => User::withoutTrashed()->where('uuid', $member['uuid'])->select('id')->first()?->id,
                        'grade' => $member['grade'],
                    ];
                });

                if ($members->count()) {
                    $divisionModel->users()->attach($members);
                }
            }

            foreach ($request->input('infrastructures', []) as $material) {
            }
        });

        return redirect(route('manage.unit.index'))->with('alert', [
            'status' => 'success',
            'message' => 'Unité créer avec succés',
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
    public function edit(Unit $unit)
    {
        return Inertia::render('Manage/Unit/Edit', [
            'unit' => $unit->load('divisions')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Unit $unit)
    {
        DB::transaction(function () use ($request, $unit) {
            return $unit->update([
                'name' => $request->input('name'),
                'abbr' => $request->input('abbr'),
                'description' => $request->input('description'),
                'address' => $request->input('address'),
                'city' => $request->input('city'),
                'country' => $request->input('country'),
            ]);
        });

        return redirect(route('manage.unit.index'))->with('alert', [
            'status' => 'success',
            'message' => 'Unité modifier avec succés'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit)
    {
        return redirect()->back()->with('alert', [
            'status' => 'error',
            'message' => "L'unité n'est pas supprimé",
        ]);
    }
}
