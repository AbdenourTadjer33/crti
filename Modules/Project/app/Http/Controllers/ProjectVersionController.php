<?php

namespace Modules\Project\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Modules\Project\Models\Project;
use App\Http\Controllers\Controller;
use Modules\Project\Enums\ProjectStatus;
use Modules\Project\Http\Requests\Version\StoreRequest;

class ProjectVersionController extends Controller
{
    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    public function index(Request $request)
    {
        dd("display all versions of project {$request->project}");

        return view('project::index');
    }

    public function create(Request $request)
    {
        /** @var Project */
        $project = $this->user->projects()
            ->where('code', $request->route('project'))
            ->where('status', ProjectStatus::creation->name)
            ->first();

        if (!$project) {
            return abort(403, "you dont have access right to this resource");
        };

        $version = $project->currentVersion();

        return Inertia::render('Project/Version/Create', [
            'version' => fn () => $version ? unserialize($version->model_data) : null,
        ]);
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
                    'user_id' => $request->user()->id,
                ]);
                return;
            }

            $version->update([
                "model_data" => $modelData,
            ]);
        });

        return $this->success();
    }

    public function store(StoreRequest $request, Project $project)
    {
        dd($request->all());

        DB::transaction(function () use ($request, $project) {
            $version = $project->versions()->create([
                'user_id' => $request->user()->id,
                'name' => $request->input('name'),
                'nature' => $request->input('nature'),
                'domains' => $request->input('domains'),
                'date_begin' => $request->input('date_begin'),
                'date_end' => $request->input('date_end'),
                'description' => $request->input('description'),
                'goals' => $request->input('goals'),
                'methodology' => $request->input('methodology'),
                'status' => $request->input('status'),
            ]);
        });
    }


    public function show($id)
    {
        return view('project::show');
    }

    public function edit($id)
    {
        return view('project::edit');
    }

    public function update(Request $request, $id)
    {
    }

    public function destroy($id)
    {
    }
}
