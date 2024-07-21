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
use Illuminate\Database\Eloquent\Builder;
use App\Http\Requests\Project\StoreRequest;

class ProjectController extends Controller
{
    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    /**
     * This endpoint return all project that user has access to.
     * - user projects under creation.
     * - 
     * 
     */
    public function index()
    {
        /**
         * This will hold all project id's that are fetched from the database.
         */

        // dd($this->user->divisions);
        return Inertia::render('Project/Index', [
            'myProjects' => fn () => $this->user->projects()->get(),
            'onProjects' => fn () => $this->user->onProjects()->whereDoesntHave('user', fn (Builder $query) => $query->where('id', $this->user->id))->get(),
            'divisionProjects' => fn () => [],
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

    public function show(Project $project)
    {
        return $this->success([
            'project' => $project
        ]);
    }
}