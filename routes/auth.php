<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\CheckUserController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticateSessionController;

Route::post('/check-user', CheckUserController::class)
    ->middleware('guest')
    ->name('check.user');

Route::get('/register', [RegisteredUserController::class, 'create'])
    ->middleware('guest')
    ->name('register.create');

Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register.store');

Route::get('/created', [RegisteredUserController::class, 'created'])
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
