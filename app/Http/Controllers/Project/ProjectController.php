<?php

namespace App\Http\Controllers\Project;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use Nette\Utils\Random;
use App\Models\Division;
use App\Enums\ProjectStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use App\Http\Resources\Project\ProjectRessource;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Requests\Project\StoreRequest;

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
            $projects = $creatorProjects->union($memberProjects)->with(['division:id,name,abbr'])->latest()->get();

            $projectInCreation =  $projects->where('user_id', $this->user->id)->where('status', ProjectStatus::creation->name);
            $rest = $projects->whereNotIn('id', $projectInCreation->pluck('id'))->load('users:id,uuid,first_name,last_name');

            return [
                'projectInCreation' => ProjectRessource::collection($projectInCreation),
                'projects' => ProjectRessource::collection($rest),
            ];
        };

        // return $projectsFn();

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
                'status' => ProjectStatus::creation->name,
                'user_id' => $request->user()->id,
                'division_id' => $request->input('division'),
            ]);
        });

        return $project->only('code');
    }

    public function show(Request $request)
    {
        $project = Project::query()
            ->where('code', $request->route('project'))
            ->whereNot('status', ProjectStatus::creation->name)
            ->first();

        if (!$project) return abort(404, 'Sorry, the page you are looking for could not be found.');

        return Inertia::render('Project/Show', [
            'project' => $project,
        ]);
    }
}
