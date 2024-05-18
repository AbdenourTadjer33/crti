<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Modules\ManageApp\Http\Controllers\RoleController;
use Modules\ManageApp\Http\Controllers\UnitController;
use Modules\ManageApp\Http\Controllers\UserController;
use Modules\ManageApp\Http\Controllers\DivisionController;
use Modules\ManageApp\Http\Controllers\PermissionController;

Route::prefix('/app/manage')->as('manage.')->middleware('auth')->group(function () {

    Route::get('/', function () {
        return Inertia::render('Manage/Manage');
    })->name('index');

    Route::resource('units', UnitController::class)->names('unit');
    // Route::resource('divisions', DivisionController::class)->names('devision');

    Route::resource('permissions', PermissionController::class)->names('permission');
    Route::resource('roles', RoleController::class)->names('role');

    Route::get('/users/search', [UserController::class, 'search'])->name('user.search');
    Route::resource('users', UserController::class)->names('user');
});