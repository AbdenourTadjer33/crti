<?php

use Illuminate\Support\Facades\Route;
use Modules\Permission\Http\Controllers\PermissionController;
use Modules\Permission\Http\Controllers\RoleController;


Route::group([], function () {
    Route::apiResource('permission', PermissionController::class)->names('permission');
});

Route::group([], function () {
    Route::apiResource('role', RoleController::class)->names('role');
});
