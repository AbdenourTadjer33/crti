<?php

namespace App\Http\Controllers\Project;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use App\Enums\ProjectStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\Version\StoreRequest;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
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
            return abort(404, 'Sorry, the page you are looking for could not be found.');
        };

        $version = $project->currentVersion();

        return Inertia::render('Project/Version/Create', [
            'version' => fn () => $version ? unserialize($version->model_data) : null,
        ]);
    }

    /**
     * This controller method is for saving project form data as the first version.
     */
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
        DB::transaction(function () use ($request, $project) {
            $members = User::withoutTrashed()->whereIn('uuid', collect($request->members)->map(fn ($member) => $member['uuid']))->get(['id', 'uuid']);

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

                $task->users()->attach($members->whereIn('uuid', $request->input('tasks.{$i}.users')));
            }
        });

        return redirect(route('project.index'))->with('alert', [
            'status' => 'success',
            'message' => 'Project created successfully'
        ]);
    }


    public function show($id)
    {
    }

    public function edit($id)
    {
    }

    public function update(Request $request, $id)
    {
    }

    public function destroy($id)
    {
    }
}
