<?php

use Illuminate\Support\Facades\Route;
use Modules\Authentification\Http\Controllers\Auth\RegisterUserController;
use Modules\Authentification\Http\Controllers\Auth\AuthenticateSessionController;

Route::get('/register', [RegisterUserController::class, 'create'])
    ->middleware('guest')
    ->name('register.create');

Route::post('/register', [RegisterUserController::class, 'store'])
    ->middleware('guest')
    ->name('register.store');

Route::get('/created', [RegisterUserController::class, 'created'])
    ->middleware(['guest', 'signed'])
    ->name('register.created');

Route::get('/login', [AuthenticateSessionController::class, 'create'])
    ->middleware('guest')
    ->name('login.create');

Route::post('/login', [AuthenticateSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login.store');

Route::delete('/logout', [AuthenticateSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout.destroy');
