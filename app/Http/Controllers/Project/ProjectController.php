<?php

namespace App\Http\Controllers\Project;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use Nette\Utils\Random;
use App\Enums\ProjectStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\Project\ProjectRessource;
use App\Http\Requests\Project\StoreRequest;
use Modules\Versioning\Models\Version;

class ProjectController extends Controller
{
    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

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
            'userDivisions' => Inertia::lazy(fn () => $this->user->divisions()->get()),
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

        return $project->only('code');
    }

    public function show(Request $request)
    {
        /** @var Project */
        $project = Project::query()
            ->where('code', $request->route('project'))
            ->whereNot('status', ProjectStatus::creation->name)
            ->first();

        if (!$project) return abort(404, 'Sorry, the page you are looking for could not be found.');

        // return ProjectRessource::collection($project->versions->map(fn (Version $version) => $version->getModel()));

        return Inertia::render('Project/Show', [
            'canEditProject' => fn () => $project->canHaveNewVersions(),
            'project' => $project,
            'versions' => ProjectRessource::collection($project->versions->map(fn (Version $version) => $version->getModel())),
        ]);
    }
}
