<?php

use Illuminate\Support\Facades\Route;
use Modules\Authentification\Http\Controllers\Auth\RegisterUserController;
use Modules\Authentification\Http\Controllers\Auth\AuthenticateSessionController;

Route::post('/register', [RegisterUserController::class, 'store'])
    ->middleware('guest')
    ->name('register');

Route::post('/login', [AuthenticateSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');


Route::post('/logout', [AuthenticateSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');