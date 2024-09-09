<?php

namespace App\Http\Controllers\Manage;

use Inertia\Inertia;
use App\Models\Project;
use App\Http\Controllers\Controller;
use App\Http\Resources\Manage\Project\ProjectBaseResource;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::with(['division:id,abbr,name', 'user:id,uuid,first_name,last_name,email'])
            ->withCount('versions')
            ->latest('updated_at')
            ->paginate();

        return Inertia::render('Manage/project/index', [
            'projects' => ProjectBaseResource::collection($projects),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }
}
