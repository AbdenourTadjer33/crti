<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuxDataService;
use Illuminate\Http\Request;

class ProjectDomainsController extends Controller
{
    public function index() {}

    public function store(Request $request, AuxDataService $auxDataService)
    {
        $request->validate([
            'domain' => ['required', 'string', 'min:4', 'max:40'],
        ]);

        $auxDataService->storeProjectDomain($request->input('domain'));
        $auxDataService->forgetProjectDomains();
        return $this->success(code: 201);
    }
}
