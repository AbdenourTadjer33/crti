<?php

use Illuminate\Support\Facades\Route;

use Modules\ManageApp\Http\Controllers\RoleController;
use Modules\ManageApp\Http\Controllers\UserController;
use Modules\ManageApp\Http\Controllers\DivisionController;
use Modules\ManageApp\Http\Controllers\PermissionController;
use Modules\ManageApp\Http\Controllers\EstablishmentController;

Route::prefix('/app/manage')->as('manage')->middleware('auth')->group(function () {
    Route::resource('establishment', EstablishmentController::class)->names('establishment');
    Route::resource('division', DivisionController::class)->names('devision');

    Route::resource('permissions', PermissionController::class)->names('permission');
    Route::resource('roles', RoleController::class)->names('role');

    Route::resource('users', UserController::class)->names('user');
});