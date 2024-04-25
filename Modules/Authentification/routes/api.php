<?php

use Illuminate\Support\Facades\Route;
use Modules\Authentification\Http\Controllers\TokenController;
use Modules\Authentification\Http\Controllers\LoginController;
use Modules\Authentification\Http\Controllers\LogoutController;
use Modules\Authentification\Http\Controllers\RegisterController;

/*
 *--------------------------------------------------------------------------
 * API Routes
 *--------------------------------------------------------------------------
 *
 * Here is where you can register API routes for your application. These
 * routes are loaded by the RouteServiceProvider within a group which
 * is assigned the "api" middleware group. Enjoy building your API!
*/

Route::prefix('v1/auth')->as('auth.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::post('/register', RegisterController::class)->name('register');
        Route::post('/login', LoginController::class)->name('login');
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', LogoutController::class)->name('logout');

        Route::prefix('tokens')->controller(TokenController::class)->as('device.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::delete('/destroy-all', 'destroyAll')->name('destroy.all');
            Route::delete('/{id}', 'destroy')->name('destroy');
        });
    });
});
