<?php

namespace App\Http\Controllers\Project;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Domain;
use App\Models\Nature;
use App\Models\Project;
use Nette\Utils\Random;
use App\Enums\ProjectStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Events\Project\ProjectInitialized;
use App\Http\Requests\Project\StoreRequest;
use App\Http\Resources\Project\ProjectRessource;
use App\Http\Resources\Project\ProjectDetailsResource;

class ProjectController extends Controller
{
    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    // TO REVIEW
    public function index()
    {
        $projectsFn = function () {
            $creatorProjects = Project::query()->where('user_id', $this->user->id);
            $memberProjects = Project::query()->whereNot('status', ProjectStatus::creation->name)->whereHas('users', function ($query) {
                $query->where('user_id', $this->user->id);
            });

            /** @var \Illuminate\Database\Eloquent\Collection|\App\Models\Project[] */
            $projects = $creatorProjects->union($memberProjects)->with(['division:id,name'])->latest()->get();

            $projectInCreation =  $projects->where('user_id', $this->user->id)->where('status', ProjectStatus::creation->name);
            $rest = $projects->whereNotIn('id', $projectInCreation->pluck('id'))->load('users:id,uuid,first_name,last_name');

            return [
                'projectInCreation' => ProjectRessource::collection($projectInCreation),
                'projects' => ProjectRessource::collection($rest),
            ];
        };

        return Inertia::render('Project/Index', [
            'data' => $projectsFn,
            'userDivisions' => Inertia::lazy(fn() => $this->user->divisions()->get()),
        ]);
    }

    public function store(StoreRequest $request)
    {
        /** @var Project */
        $project = DB::transaction(function () use ($request) {
            return Project::create([
                'code' => Random::generate(),
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
        ]);
    }

    public function suggest(Request $request)
    {
        $request->validate([
            'value' => ['required', 'string', 'min:4', 'max: 50'],
        ]);

        if ($request->routeIs('project.suggest.domain')) return Domain::suggest($request->input('value'));

        return Nature::suggest($request->input('value'));
    }
}
