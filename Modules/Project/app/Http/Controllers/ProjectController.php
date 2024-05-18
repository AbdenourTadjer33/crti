<?php

namespace Modules\Project\Http\Controllers;

use App\Models\User;
use App\Actions\History;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Modules\Project\Models\Project;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Modules\Project\Http\Requests\StoreRequest;
use Modules\Project\Http\Requests\UpdateRequest;

class ProjectController extends Controller
{
    /** @var User */
    protected $user;

    public function test()
    {
        /** @var Project */
        $project = Project::first();

        $this->user;

        $project->updateStatus('en examen');

        // action + utilisateur + instance + attribute + now



    }

    public function __construct(Request $request)
    {
        $this->user = $request->user();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return Inertia::render('Project/Index');
        return $this->success([
            'projects' => Project::get()
        ]);
    }

    public function store(StoreRequest $request): JsonResponse
    {
        $project = DB::transaction(function () use ($request) {
            /** @var Project */
            $project = Project::create($request->only([]));
            $version = $project->versions()->create([
                'user_id' => $this->user->id
            ]);
            return $project->setRelation('versions', collect($version));
        });

        return $this->success([
            'project' => $project
        ]);
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
