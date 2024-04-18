<?php

use Illuminate\Support\Facades\Route;
use Modules\Unit\Http\Controllers\UnitController;

/*
 *--------------------------------------------------------------------------
 * API Routes
 *--------------------------------------------------------------------------
 *
 * Here is where you can register API routes for your application. These
 * routes are loaded by the RouteServiceProvider within a group which
 * is assigned the "api" middleware group. Enjoy building your API!
 *
*/

Route::prefix('v1')->group(function () {
    Route::prefix('unit')->as('unit.')->group(function () {
        Route::put('{unit}/restore', [UnitController::class, 'restore'])->withTrashed()->name('restore');
        Route::delete('{unit}/force-destroy', [UnitController::class, 'forceDestroy'])->withTrashed()->name('force.destroy');
    });
    Route::apiResource('unit', UnitController::class,)->names('unit');
});
