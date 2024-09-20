<?php

use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\ExistingResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Events\Project\ProjectCreated;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\UserBaseResource;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Board\BoardController;
use App\Http\Controllers\Manage\RoleController;
use App\Http\Controllers\Manage\UnitController;
use App\Http\Controllers\Manage\UserController;
use App\Http\Middleware\ShareDataWithWorkspace;
use App\Http\Resources\Project\ProjectResource;
use App\Http\Controllers\Board\BoardPostComment;
use App\Http\Controllers\Manage\ManageController;
use App\Http\Controllers\Workspace\MainController;
use App\Http\Controllers\Manage\ResourceController;
use App\Http\Controllers\Project\ProjectController;
use App\Services\Project\Project as ProjectService;
use App\Http\Controllers\Workspace\KanbanController;
use App\Http\Controllers\Manage\UnitDivisionController;
use App\Http\Controllers\Workspace\WorkspaceController;
use App\Http\Controllers\Project\ProjectVersionController;
use App\Http\Controllers\Workspace\SuggestedVersionController;
use App\Http\Controllers\Manage\BoardController as ManageBoardController;
use App\Http\Controllers\Manage\ProjectController as ManageProjectController;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('/app')->middleware(['auth', 'permission:application.access'])->group(function () {
    Route::get('/', fn() => Inertia::render('Welcome'))->name('app');

    Route::singleton('profile', ProfileController::class)->except('edit')->names('profile');

    Route::prefix('/manage')->as('manage.')->group(function () {
        Route::get('/', ManageController::class)->name('index');

        Route::middleware('permission:roles&permissions.manage')->resource('roles', RoleController::class)->names('role');

        Route::middleware('permission:units&divisions.manage')->group(function () {
            Route::resource('units', UnitController::class)->names('unit');
            Route::post('/units/{unit}/divisions/{division}/attach/users', [UnitDivisionController::class, 'attachUsers'])->name('unit.division.attach.users');
            Route::post('/units/{unit}/divisions/{division}/detach/users', [UnitDivisionController::class, 'detachUsers'])->name('unit.division.detach.users');
            Route::post('/units/{unit}/divisions/{division}/users/{user}/edit', [UnitDivisionController::class, 'editGrade'])->name('unit.division.edit.grade');
            Route::resource('units.divisions', UnitDivisionController::class)->except('index')->names('unit.division');
        });

        Route::middleware('permission:users.manage')->group(function () {
            Route::post('/users/{user}/sync/access', [UserController::class, 'syncAccess'])->name('user.sync.access');
            Route::post('/users/{user}/sync/divisions', [UserController::class, 'syncDivisions'])->name('user.sync.divisions');
            Route::post('/users/{user}/accept', [UserController::class, 'accept'])->name('user.accept');
            Route::post('/users/{user}/reject', [UserController::class, 'reject']);
            Route::resource('users', UserController::class)->names('user');
        });

        Route::middleware('permission:boards.manage')->resource('boards', ManageBoardController::class)->names('board');

        Route::middleware('permission:resources.manage')->resource('resources', ResourceController::class)->names('resource');

        Route::middleware('permission:projects.manage')->resource('projects', ManageProjectController::class)->only(['index', 'show'])->names('project');
    });

    Route::prefix('search')->as('search.')->group(function () {
        Route::get('users', function (Request $request) {
            if (app()->isProduction() && !$request->isXmlHttpRequest()) return abort(401);

            if (!$request->input('query')) return abort(404);

            $users = User::search($request->input('query'))->get();

            return UserBaseResource::collection($users);
        })->name('user');

        Route::get('projects', function (Request $request) {
            if (app()->isProduction() && !$request->isXmlHttpRequest()) return abort(401);

            if (!$request->input('query')) return abort(404);

            $baseQuery = Project::search($request->input('query'))
                ->query(function (Builder $query) use ($request) {
                    $query->with(['division:id,unit_id,abbr,name', 'division.unit:id,abbr,name', 'user:id,uuid,first_name,last_name', 'nature:id,name']);

                    if ($request->input('status', []) && $filter = array_intersect($request->input('status', []), ["new", "review", "pending", "suspended", "rejected", "completed"])) {
                        $query->whereIn('status', $filter);
                        unset($filter);
                    }
                });

            return ProjectResource::collection($baseQuery->get());
        })->name('project');

        Route::get('resources', function (Request $request) {
            if (app()->isProduction() && !$request->isXmlHttpRequest()) return abort(401);

            if (!$request->input('query')) return abort(404);

            $resources = ExistingResource::search($request->input('query'))->get();

            return $resources->map(fn($resource) => $resource->only(['code', 'name', 'description']));
        })->name('resource');
    });

    Route::prefix('projects/suggest')->as('project.suggest.')->group(function () {
        Route::post('nature', function (Request $request) {
            $request->validate([
                'value' => ['required', 'string', 'min:3', 'max:50'],
            ]);

            return \App\Models\Nature::suggest($request->input('value'));
        })->name('nature');

        Route::post('domain', function (Request $request) {
            $request->validate([
                'value' => ['required', 'string', 'min:3', 'max:50'],
            ]);

            return \App\Models\Domain::suggest($request->input('value'));
        })->name('domain');
    });

    Route::resource('projects', ProjectController::class)->only(["index", "store", "show"])->names('project');
    Route::post('projects/{project}/versions/duplicate/main/version', [ProjectVersionController::class, 'duplicate'])->name('project.version.duplicate');
    Route::post('projects/{project}/versions/{version}/sync', [ProjectVersionController::class, 'sync'])->name('project.version.sync');
    Route::post('projects/{project}/versions/{version}/accept', [ProjectVersionController::class, 'accept'])->name('project.version.accept');
    Route::post('projects/{project}/versions/{version}/reject', [ProjectVersionController::class, 'reject'])->name('project.version.reject');
    Route::resource('projects.versions', ProjectVersionController::class)->only(['create', 'store', 'edit', 'update'])->names('project.version');

    Route::middleware('permission:boards.access')->group(function () {
        Route::post('/boards/{board}/comments', BoardPostComment::class)->name('board.comment.store');
        Route::post('/boards/{board}/accept', [BoardController::class, 'accept'])->name('board.accept');
        Route::post('/boards/{board}/reject', [BoardController::class, 'reject'])->name('board.reject');
        Route::resource('boards', BoardController::class)->only('index', 'show')->names('board');
    });

    Route::prefix('/workspace')->as('workspace.')->middleware(['permission:workspace.access', ShareDataWithWorkspace::class])->group(function () {
        Route::get('/', MainController::class)->name('index');
        Route::get('/{project}', [WorkspaceController::class, 'project'])->name('project');
        Route::get('/{project}/kanban', [KanbanController::class, 'index'])->name('kanban');
        Route::resource('/{project}/suggested/versions', SuggestedVersionController::class)
            ->only(['index', 'show'])
            ->names('suggested.version');
    });

    Route::prefix('projects/{project}/tasks/{task}')->as('project.task.')->group(function () {
        Route::post('/start', [KanbanController::class, 'start'])->name('start');
        Route::post('/suspend', [KanbanController::class, 'suspend'])->name('suspend');
        Route::post('/cancel', [KanbanController::class, 'cancel'])->name('cancel');
        Route::post('/end', [KanbanController::class, 'end'])->name('end');
        Route::any('/resum', [KanbanController::class, 'resum'])->name('resum');
    });
});

Route::get('/test/project-insretion', function () {
    $data = Storage::json('data/projects.json');
    $projectService = new ProjectService();


    $project = DB::transaction(function () use ($data, $projectService) {
        $project = $projectService->init([
            'user_id' => data_get($data, 'members.0.id'),
            'division_id' => data_get($data, 'division'),
        ]);

        $project = $projectService->store($project, $data);

        $version = $project->versions()->create([
            'model_data' => serialize($project->toArray()),
            'user_id' => $project->user->id,
        ]);

        $project->refVersionAsMain($version->id);

        event(new ProjectCreated($project->id));

        return $project;
    });

    return $project;
});

require __DIR__ . DIRECTORY_SEPARATOR . "auth.php";
