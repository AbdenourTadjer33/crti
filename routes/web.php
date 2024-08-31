<?php

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Board\BoardController;
use App\Http\Controllers\Manage\RoleController;
use App\Http\Controllers\Manage\UnitController;
use App\Http\Controllers\Manage\UserController;
use App\Http\Controllers\Board\BoardPostComment;
use App\Http\Controllers\Manage\ManageController;
use App\Http\Controllers\Manage\ResourceController;
use App\Http\Controllers\Project\ProjectController;
use App\Http\Controllers\Manage\PermissionController;
use App\Http\Controllers\Manage\UnitDivisionController;
use App\Http\Controllers\Project\ProjectVersionController;
use App\Http\Controllers\Manage\BoardController as ManageBoardController;
use App\Http\Controllers\Manage\ProjectController as ManageProjectController;
use App\Http\Controllers\Workspace\MainController;
use App\Http\Controllers\Workspace\WorkspaceController;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('/app')->middleware(['auth', 'permission:access.application'])->group(function () {
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
        Route::middleware('permission:manage.units&divisions')->resource('units', UnitController::class)->names('unit');
        Route::middleware('permission:manage.units&divisions')->resource('units.divisions', UnitDivisionController::class)->except('index')->names('unit.division');
        Route::middleware('permission:manage.permissions&roles')->resource('permissions', PermissionController::class)->names('permission');
        Route::middleware('permission:manage.permissions&roles')->resource('roles', RoleController::class)->names('role');
        Route::middleware('permission:manage.users')->resource('users', UserController::class)->names('user');
        Route::middleware('permission:manage.boards')->resource('boards', ManageBoardController::class)->names('board');
        Route::middleware('permission:manage.resources')->resource('resources', ResourceController::class)->names('resource');
        Route::middleware('permission:manage.projects')->resource('projects', ManageProjectController::class)->only(['index', 'show'])->names('project');
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

Route::prefix('/workspace')->as('workspace.')->middleware(['auth', 'permission:access.workspace'])->group(function () {
    Route::get('/', MainController::class)->name('index');
    Route::get('/{project}', [WorkspaceController::class, 'project'])->name('project');
    Route::get('/{project}/calendar', [WorkspaceController::class, 'calendar'])->name('calendar');
    Route::get('/{project}/kanban', [WorkspaceController::class, 'kanban'])->name('kanban');
    Route::get('/{project}/review/versions', [WorkspaceController::class, 'show'])->name('suggested.version');

    // Route::resource('projectd');
    // Route::get('/{project}/kanban', Work)
    // Route::get("", WorkspaceController::class);
    // Route::get('/{}')
});

require __DIR__ . DIRECTORY_SEPARATOR . "auth.php";
