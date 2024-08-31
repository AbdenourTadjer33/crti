<?php

namespace App\Http\Controllers\Project;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Domain;
use App\Models\Nature;
use App\Models\Project;
use App\Enums\ProjectStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Events\Project\ProjectInitialized;
use App\Http\Requests\Project\StoreRequest;
use Illuminate\Routing\Controllers\Middleware;
use App\Http\Resources\Project\ProjectRessource;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Http\Resources\Project\ProjectDetailsResource;
use App\Http\Resources\Project\ProjectInCreationResource;

class ProjectController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:access.projects|access-related.projects|access-related.members.projects|access-related.divisions.projects|create.projects',  only: ['index', 'show']),
        ];
    }

    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    public function index(Request $request)
    {
        $projectsFn = function () use ($request) {
            $baseQuery = Project::with(['division:id,unit_id,abbr,name', 'division.unit:id,abbr,name', 'nature:id,name', 'users', 'user'])
                ->whereNot('status', 'creation');

            if ($request->input('status')) {
                $baseQuery->whereIn('status', $request->input('status'));;
            }

            if ($this->user->can('access.projects')) {
                // Full access, so no need to filter further, directly return
                return ProjectRessource::collection($baseQuery->get());
            }

            $baseQuery->where(function ($query) {
                // Check related projects the user owns
                if ($this->user->can('access-related.projects')) {
                    $query->orWhere('user_id', $this->user->id);
                }

                // Check projects where the user is a member
                if ($this->user->can('access-related.members.projects')) {
                    $query->orWhereHas('users', function ($userQuery) {
                        $userQuery->where('user_id', $this->user->id);
                    });
                }

                // Check projects in the user's divisions
                if ($this->user->can('access-related.divisions.projects')) {
                    $query->orWhereIn('division_id', $this->user->divisions()->pluck('id'));
                }
            });

            return ProjectRessource::collection($baseQuery->get());
        };

        $projectsInCreationFn = function () {

            $projects = Project::with([
                'division:id,unit_id,name,abbr',
                'division.unit:id,name,abbr',
                'versions' => fn($query) => $query->select(['id', 'versionable_type', 'versionable_id', 'updated_at'])->latest('updated_at')->limit(1)
            ])->where('user_id', $this->user->id)
                ->where('status', 'creation')->get()
                ->sortByDesc(function ($project) {
                    return max($project->created_at, optional($project->versions->first())->updated_at);
                });

            return ProjectInCreationResource::collection($projects);
        };

        return Inertia::render('Project/Index', [
            'projects' => $projectsFn,
            'projectsInCreation' => $projectsInCreationFn,
            'userDivisions' => Inertia::lazy(fn() => $this->user->divisions()->get()),
            'canCreateProjects' => fn() => $this->user->hasPermissionTo('create.projects'),
        ]);
    }

    public function store(StoreRequest $request)
    {
        /** @var Project */
        $project = DB::transaction(function () use ($request) {
            return $this->user->projects()->create([
                'status' => 'creation',
                'user_id' => $this->user->id,
                'division_id' => $request->input('division'),
            ]);
        });

        event(new ProjectInitialized($this->user->id, $project->id));

        return $project->only('code');
    }

    public function show(Request $request)
    {
        /** @var Project */
            $project = Project::query()
            ->where('code', $request->route('project'))
            ->whereNot('status', ProjectStatus::creation->name)
            ->first(['id', 'code', 'status', 'version_info']);

        if (!$project) return abort(404, 'Sorry, the page you are looking for could not be found.');

        $versionInCreationFn = function () use ($project) {
            $versionIds = $project->getVersionMarkedAs('creation');
            if (!$versionIds) return;

            $version = $project->versions()->whereIn('id', $versionIds)->where('user_id', $this->user->id)->first(['id', 'reason', 'created_at']);
            return $version;
        };

        return Inertia::render('Project/Show', [
            'project' => fn() => new ProjectDetailsResource($project->getMainVersion()->getModel()),
            'canCreateNewVersion' => fn() => $project->canHaveNewVersions(),
            'versionInCreation' => $versionInCreationFn,
            'havePreviousVersion' => fn() => (bool)$project->getVersionMarkedAs('previous'),
            'haveVersionInReview' => fn() => $this->user->id === $project->user_id && $project->getVersionMarkedAs('review'),
        ]);
    }

    public function suggest(Request $request)
    {
        Gate::authorize('create.projects');

        $request->validate([
            'value' => ['required', 'string', 'min:4', 'max: 50'],
        ]);

        if ($request->routeIs('project.suggest.domain')) return Domain::suggest($request->input('value'));

        return Nature::suggest($request->input('value'));
    }
}
