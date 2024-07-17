<?php

use Illuminate\Support\Facades\Route;
use Modules\Project\Http\Controllers\ProjectController;
use Modules\Project\Http\Controllers\ProjectVersionController;

Route::prefix('app')->middleware('auth')->group(function () {
    Route::post('/projects/{project}/versions/sync', [ProjectVersionController::class, 'sync'])->name('project.version.sync');
    Route::resource('projects', ProjectController::class)->only(["index", "store", "show"])->names('project');
    Route::resource('projects.versions', ProjectVersionController::class)->names('project.version');
});
