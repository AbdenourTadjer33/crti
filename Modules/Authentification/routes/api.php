<?php

use Illuminate\Support\Facades\Route;
use Modules\Authentification\Http\Controllers\Api\CheckUserController;

Route::prefix('v1/auth')->as('auth.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::post('/check-user', CheckUserController::class)->name('check.user');
    });
});
