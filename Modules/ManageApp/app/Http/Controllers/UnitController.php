<?php

namespace Modules\ManageApp\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Modules\Unit\Models\Unit;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Modules\ManageApp\Http\Requests\Unit\StoreRequest;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Manage/Unit/Index', [
            'units' => Unit::get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Manage/Unit/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        DB::transaction(function () use ($request) {
            return Unit::create([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
            ]);
        });

        return redirect(route('manage.unit.index'))->with('alert', [
            'status' => 'success',
            'message' => 'Unit created successfully',
        ]);
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('client::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('client::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}
