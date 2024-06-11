<?php

namespace Modules\Project\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Modules\Project\Models\Project;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\Middleware;
use Modules\Project\Http\Requests\StoreRequest;
use Modules\Project\Http\Requests\UpdateRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;

class ProjectController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware(HandlePrecognitiveRequests::class, only: ['store'])
        ];
    }

    public function index()
    {

        return Inertia::render('Project/Index');
        return $this->success([
            'projects' => Project::get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Project/Create');
    }

    public function store(StoreRequest $request): JsonResponse
    {

        dd("on the store method of the project controller");
        // $project = DB::transaction(function () use ($request) {
        //     /** @var Project */
        //     $project = Project::create($request->only([]));
        //     $version = $project->versions()->create([
        //         'user_id' => $this->user->id
        //     ]);
        //     return $project->setRelation('versions', collect($version));
        // });

        // return $this->success([
        //     'project' => $project
        // ]);
    }

    public function show(Project $project)
    {
        return $this->success([
            'project' => $project
        ]);
    }

    public function update(UpdateRequest $request, Project $project): JsonResponse
    {
        DB::transaction(function () use ($project) {
            $project->versions()->create([]);
        });

        return $this->success([
            'project' => $project
        ]);

    }

    public function destroy(Project $project)
    {
        DB::transaction(
            fn () => $project->delete()
        );

    }
}
