<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuxDataService;
use Illuminate\Http\Request;

class ProjectNaturesController extends Controller
{
    public function index() {}

    public function store(Request $request, AuxDataService $auxDataService)
    {
        $request->validate([
            'nature' => ['required', 'string', 'min:4'],
        ]);

        $auxDataService->storeProjectNature($request->input('nature'));
        $auxDataService->forgetProjectNatures();
        return $this->success(code: 201);
    }
}
