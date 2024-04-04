<?php

use Illuminate\Support\Facades\Route;
use Modules\Permission\Http\Controllers\PermissionController;

Route::group([], function () {
    Route::apiResource('permission', PermissionController::class)->names('permission');
});
