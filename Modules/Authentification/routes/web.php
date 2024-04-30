<?php

use Illuminate\Support\Facades\Route;
use Modules\Authentification\Http\Controllers\Auth\RegisterUserController;
use Modules\Authentification\Http\Controllers\Auth\AuthenticateSessionController;
use Modules\Authentification\Http\Controllers\Auth\AuthUserController;

Route::get('/auth', [AuthUserController::class, 'create'])
    ->middleware('guest')
    ->name('auth.create');

Route::get('/auth/created', [AuthUserController::class, 'created'])
    ->middleware(['guest', 'signed'])
    ->name('auth.created');

Route::post('/register', [RegisterUserController::class, 'store'])
    ->middleware('guest')
    ->name('register.store');


Route::post('/login', [AuthenticateSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login.store');


Route::delete('/logout', [AuthenticateSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout.destroy');
