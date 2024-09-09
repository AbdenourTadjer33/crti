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
use App\Events\Project\ProjectInitialized;
use App\Http\Requests\Project\StoreRequest;
use Illuminate\Routing\Controllers\Middleware;
use App\Http\Resources\Project\ProjectRessource;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Http\Resources\Project\ProjectDetailsResource;
use App\Http\Resources\Project\ProjectInCreationResource;
use App\Http\Resources\Project\ProjectMemberResource;
use App\Http\Resources\Project\ProjectPreviousVersionResource;

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

            if (!$this->user->canAny(['access.projects', 'access-related.projects', 'access-related.members.projects', 'access-related.divisions.projects'])) {
                return [];
            }

            /** @var Illuminate\Database\Eloquent\Builder */
            $baseQuery = Project::with(['division:id,unit_id,abbr,name', 'division.unit:id,abbr,name', 'nature:id,name', 'users', 'user'])
                ->whereNot('status', 'creation');

            if ($request->input('status', []) && $filter = array_intersect($request->input('status', []), ["new", "review", "pending", "suspended", "rejected", "completed"])) {
                $baseQuery->whereIn('status', $filter);
                unset($filter);
            }


            if ($request->input('sort') && in_array($request->input('sort'), ["by_creation_date", "by_name"])) {
                if ($request->input('sort') === "by_name") $baseQuery->orderBy('name');
                if ($request->input('sort') === "by_creation_date") $baseQuery->orderBy('created_at');
            } else {
                $baseQuery->latest('updated_at');
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
        $project = Project::with(['nature', 'domains', 'partner', 'users', 'tasks', 'tasks.users', 'existingResources', 'requestedResources', 'division:id,unit_id,abbr,name', 'division.unit:id,abbr,name'])
            ->where('code', $request->route('project'))
            ->whereNot('status', ProjectStatus::creation->name)
            ->first();

        if (!$project) return abort(404);

        $previousVersionFn = function () use ($project) {
            $versionIds = [...$project->getVersionMarkedAs('previous'), $project->getVersionMarkedAs('main')];

            if (count($versionIds) === 1) return;

            $project->load([
                'versions' => fn($query) => $query->whereIn('id', $versionIds)->select(['id', 'versionable_id', 'versionable_type', 'user_id', 'reason', 'created_at'])->latest(),
                'versions.user:id,uuid,first_name,last_name,email'
            ]);

            return $project->versions->map(fn($version) => [
                'name' => 'Version ' . (array_search($version->id, $versionIds) + 1),
                'reason' => $version->reason,
                'creator' => new ProjectMemberResource($version->user),
                'isSuggested' => $version->user->id !== $project->user_id,
                'isFirstVersion' => $project->versions->last()->id === $version->id,
                'createdAt' => $version->created_at,
            ]);
        };

        return Inertia::render('Project/Show', [
            'project' => fn() => new ProjectDetailsResource($project),
            'canCreateNewVersion' => fn() => $project->canHaveNewVersions() && $this->user->can('suggest.versions'),
            'previousVersions' => $previousVersionFn,
            // 'versionInCreation' => $versionInCreationFn,
        ]);
    }
}


// $versionInCreationFn = function () use ($project) {
//     $versionIds = $project->getVersionMarkedAs('creation');
//     if (!$versionIds) return;
//     $version = $project->versions()->whereIn('id', $versionIds)->where('user_id', $this->user->id)->first(['id', 'reason', 'created_at']);
//     return $version;
// };