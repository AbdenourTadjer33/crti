<?php

namespace Modules\Unit\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Modules\Unit\Http\Requests\StoreRequest;
use Modules\Unit\Http\Requests\UpdateRequest;
use Modules\Unit\Models\Unit;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return $this->success([
            'Units' => Unit::withTrashed()->get()
        ]);
    }

    public function store(StoreRequest $request): JsonResponse
    {
        $unit = DB::transaction(
            fn () =>
            Unit::create([
                'name' => $request->input('name'),
                'code' => $request->input('code'),
                'description' => $request->input('description'),
                'address' => $request->input('address'),
                'city' => $request->input('city'),
                'country' => $request->input('country'),
                'coordinates' => $request->input('coordinates')
            ])
        );
        return $this->success([
            'unit' => $unit
        ]);
    }

    public function show(Unit $unit)
    {
        return $this->success([
            'unit' => $unit
        ]);
    }

    public function update(UpdateRequest $request, Unit $unit): JsonResponse
    {
        DB::transaction(
            fn () =>
            $unit->update([
                'name' => $request->input('name'),
                'code' => $request->input('code'),
                'description' => $request->input('description'),
                'address' => $request->input('address'),
                'city' => $request->input('city'),
                'country' => $request->input('country'),
                'coordinates' => $request->input('coordinates')
            ])
        );
        return $this->success([
            'unit' => $unit
        ]);
    }

    public function destroy(Unit $unit)
    {
        DB::transaction(
            fn () => $unit->delete()
        );

        return $this->success([]);
    }

    public function forceDestroy(Unit $unit)
    {
        DB::transaction(
            fn () => $unit->forceDelete()
        );
        return $this->success([]);
    }

    public function restore(Unit $unit)
    {
        DB::transaction(
            fn () => $unit->restore()
        );
        return $this->success([]);
    }
}
