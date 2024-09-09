<?php

namespace App\Http\Controllers\Manage;

use Inertia\Inertia;
use App\Models\ExistingResource as Resource;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\Manage\Resource\StoreRequest;
use App\Http\Requests\Manage\Resource\UpdateRequest;
use App\Http\Resources\ExistingResource;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Manage/resource/index', [
            'resources' => fn() => ExistingResource::collection(Resource::query()->paginate()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Manage/resource/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        DB::transaction(
            fn() => Resource::query()->create([
                'code' => $request->input('code'),
                'name' => $request->input('name'),
                'state' => $request->input('state'),
                'description' => $request->input('description'),
            ])
        );

        return redirect(route('manage.resource.index'))->with('alert', [
            'status' => 'success',
            'message' => 'Ressource créer avec succés',
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
