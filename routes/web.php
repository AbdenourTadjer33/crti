<?php

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Board\BoardController;
use App\Http\Controllers\Board\BoardPostComment;
use App\Http\Controllers\Manage\RoleController;
use App\Http\Controllers\Manage\UnitController;
use App\Http\Controllers\Manage\UserController;
use App\Http\Controllers\Manage\ManageController;
use App\Http\Controllers\Manage\ResourceController;
use App\Http\Controllers\Project\ProjectController;
use App\Http\Controllers\Manage\PermissionController;
use App\Http\Controllers\Manage\UnitDivisionController;
use App\Http\Controllers\Project\ProjectVersionController;
use App\Http\Controllers\Manage\BoardController as ManageBoardController;
use App\Http\Controllers\Manage\ProjectController as ManageProjectController;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('/app')->middleware(['auth'])->group(function () {
    Route::get('/', fn() => Inertia::render('Welcome'))->name('app');

    Route::get('search/users', function (Request $request) {
        if (app()->isProduction() && !$request->isXmlHttpRequest()) {
            abort(401);
        }

        if (!$request->input('query')) {
            return abort(404);
        }

        $searchResult = User::search($request->input('query'))->get();

        if (!$searchResult->count()) {
            return [];
        }

        return collect($searchResult)->map(function (User $user) {
            return [
                'name' => $user->first_name . ' ' . $user->last_name,
                ...$user->only('uuid', 'email'),
            ];
        });
    })->name('search.user');

    Route::prefix('/manage')->as('manage.')->group(function () {
        Route::get('/', ManageController::class)->name('index');
        Route::resource('units', UnitController::class)->names('unit');
        Route::resource('units.divisions', UnitDivisionController::class)->except('index')->names('unit.division');
        Route::resource('permissions', PermissionController::class)->names('permission');
        Route::resource('roles', RoleController::class)->names('role');
        Route::resource('users', UserController::class)->names('user');
        Route::resource('boards', ManageBoardController::class)->names('board');
        Route::resource('resources', ResourceController::class)->names('resource');
        Route::resource('projects', ManageProjectController::class)->only(['index', 'show'])->names('project');
    });

    Route::post('projects/suggest/nature', [ProjectController::class, 'suggest'])->name('project.suggest.nature');
    Route::post('projects/suggest/domain', [ProjectController::class, 'suggest'])->name('project.suggest.domain');

    Route::resource('projects', ProjectController::class)->only(["index", "store", "show"])->names('project');
    Route::post('projects/{project}/versions/duplicate/main/version', [ProjectVersionController::class, 'duplicate'])->name('project.version.duplicate');
    Route::post('projects/{project:code}/versions/{version:id}/sync', [ProjectVersionController::class, 'sync'])->name('project.version.sync');
    Route::resource('projects.versions', ProjectVersionController::class)->only(['create', 'store', 'edit', 'update'])->names('project.version');

    Route::post('/boards/{board}/comments', BoardPostComment::class)->name('board.comment.store');
    Route::resource('boards', BoardController::class)->only('index', 'show')->names('board.index');
});
