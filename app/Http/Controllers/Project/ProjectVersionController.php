<?php

namespace App\Http\Controllers\Project;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use App\Enums\ProjectStatus;
use Illuminate\Http\Request;
use App\Services\AuxDataService;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Modules\Versioning\Models\Version;
use App\Http\Requests\Version\EditRequest;
use App\Http\Requests\Version\StoreRequest;
use App\Http\Requests\Version\CreateRequest;
use App\Http\Requests\Version\UpdateRequest;
use Illuminate\Routing\Controllers\Middleware;
use App\Http\Requests\Version\DuplicateRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Http\Resources\Project\ProjectVersionResource;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;

class ProjectVersionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(HandlePrecognitiveRequests::class, only: ['store'])
        ];
    }

    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    public function create(CreateRequest $request, AuxDataService $auxDataService)
    {
        /** @var Project */
        $project = $this->user->projects()->getQuery()
            ->withCount('versions')
            ->where('code', $request->route('project'))
            ->first();

        if (!$project || !$project->isFirstVersion($project->versions_count)) return abort(404);

        $versionFn = function () use ($project) {
            $version = $project->currentVersion();
            return $version ? unserialize($version->model_data) : null;
        };

        return Inertia::render('Project/Create', [
            'version' => $versionFn,
            'domains' => Inertia::lazy(fn() => collect($auxDataService->getProjectDomains())->map(fn($domain) => $domain->domain)),
            'natures' => Inertia::lazy(fn() => collect($auxDataService->getProjectNatures())->map(fn($nature) => $nature->nature)),
        ]);
    }

    /**
     * Update all the project state by the coming data.
     * Update the project current version by the project & project relations data.
     * Finnaly reference this current version as the main project version.
     * Send success response to the user
     */
    public function store(StoreRequest $request, Project $project)
    {
        DB::transaction(function () use ($request, $project) {
            $members = User::withoutTrashed()->whereIn('uuid', collect($request->members)->map(fn($member) => $member['uuid']))->get(['id', 'uuid']);

            $project->update([
                'status' => 'new',
                'name' => $request->input('name'),
                'nature' => $request->input('nature'),
                'domains' => $request->input('domains'),
                'date_begin' => Carbon::parse($request->input('timeline.from'))->format('Y-m-d'),
                'date_end' => Carbon::parse($request->input('timeline.to'))->format('Y-m-d'),
                'description' => $request->input('description'),
                'goals' => $request->input('goals'),
                'methodology' => $request->input('methodology'),
            ]);

            $project->users()->attach($members->pluck('id'));

            for ($i = 0; $i < count($request->tasks); $i++) {
                /** @var Task */
                $task = $project->tasks()->create([
                    'name' => $request->input("tasks.{$i}.name"),
                    'date_begin' => Carbon::parse($request->input("tasks.{$i}.timeline.from"))->format('Y-m-d'),
                    'date_end' => Carbon::parse($request->input("tasks.{$i}.timeline.to"))->format('Y-m-d'),
                    'description' => $request->input("tasks.{$i}.description"),
                    'priority' => $request->input("tasks.{$i}.priority"),
                ]);

                $task->users()->attach($members->whereIn('uuid', $request->input("tasks.{$i}.users"))->pluck('id'));
            }

            $currentVersion = $project->currentVersion();

            $currentVersion->update([
                'model_data' => serialize($project->load([
                    'division:id,unit_id,name,abbr',
                    'division.unit:id,name,abbr',
                    'user:id,uuid,first_name,last_name,email',
                    'users:id,uuid,first_name,last_name,email',
                    'tasks',
                    'tasks.users:id,uuid,first_name,last_name,email'
                ])->toArray()),
                'reason' => "This represent the project main version",
                'user_id' => $this->user->id,
            ]);

            $project->refVersionAsMain($currentVersion->id);
        });

        return redirect(route('project.index'))->with('alert', [
            'status' => 'success',
            'message' => 'Project created successfully'
        ]);
    }

    public function edit(EditRequest $request, AuxDataService $auxDataService)
    {
        $versionFn = function () use ($request) {
            $version = Version::query()->where('id', $request->route('version'))->first();
            return unserialize($version->model_data);
        };

        // return $versionFn();

        return Inertia::render('Project/Edit', [
            'version' => $versionFn,
            'domains' => Inertia::lazy(fn() => collect($auxDataService->getProjectDomains())->map(fn($domain) => $domain->domain)),
            'natures' => Inertia::lazy(fn() => collect($auxDataService->getProjectNatures())->map(fn($nature) => $nature->nature)),
        ]);
    }

    public function update(UpdateRequest $request)
    {
        // dd($request->all(), (new ProjectVersionResource(Version::query()->where('id', $request->route('version'))->first()->getModel()))->toArray($request));
    }

    /**
     * Get the right version to duplicate.
     * Duplicate the version by editing some data like the reason & the creator of this version.
     * Reference this version as under creation. 
     */
    public function duplicate(DuplicateRequest $request)
    {
        /** @var Project */
        $project = Project::query()->where('code', $request->route('project'))->first();

        // First, get the version IDs that are in creation mode
        $versionIds = $project->getCreationVersions();

        // Check if the user has any versions in creation mode
        if ($versionIds && $project->versions()->whereIn('id', $versionIds)->where('user_id', $this->user->id)->count()) {
            // Send an error back to the user
            throw new HttpResponseException(
                $this->error(code: 409, message: "You already have a version in creation mode. Please complete or discard it before creating a new one."),
            );
        }

        $version = DB::transaction(function () use ($project, $request) {
            /** @var Version */
            $version = $project->getMainVersion(false)->replicate(['reason', 'user_id']);

            $version->user_id = $this->user->id;
            $version->reason = $request->input('reason');
            $version->model_data = serialize([
                'data' => json_decode((new ProjectVersionResource($version->getModel()))->toJson(), true),
                'params' => []
            ]);

            $version->save();
            $project->refVersionAsCreation($version->id);

            return $version;
        });

        return ['project' =>  $project->code, 'version' => $version->id];
    }

    public function sync(Request $request)
    {
        /** @var Project */
        $project = $this->user->projects()
            ->where('code', $request->route('project'))
            ->where('status', ProjectStatus::creation->name)
            ->first();


        DB::transaction(function () use ($project, $request) {
            $modelData = serialize($request->all());
            $version = $project->currentVersion();
            if (!$version) {
                $project->versions()->create([
                    'model_data' => $modelData,
                    'reason' => 'creating the project first version',
                    'user_id' => $this->user->id,
                ]);
                return;
            }

            $version->update([
                "model_data" => $modelData,
            ]);
        });

        return $this->success();
    }
}
