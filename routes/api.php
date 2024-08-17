<?php

use App\Http\Controllers\Api\ProjectDomainsController;
use App\Http\Controllers\Api\ProjectNaturesController;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth'])->group(function () {
    Route::get('/project_domains', [ProjectDomainsController::class, "index"])->name('api.project.domain.index');
    Route::post('/project_domains', [ProjectDomainsController::class, "store"])->name('api.project.domain.store');

    Route::get('/project_natures', [ProjectNaturesController::class, "index"])->name('api.project.nature.index');
    Route::post('/project_natures', [ProjectNaturesController::class, "store"])->name('api.project.nature.store');
});
