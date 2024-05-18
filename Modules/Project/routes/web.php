<?php

use Illuminate\Support\Facades\Route;
use Modules\Project\Http\Controllers\ProjectController;

Route::prefix('app')->middleware('auth')->group(function () {
    Route::resource('project', ProjectController::class)->names('project');
});
