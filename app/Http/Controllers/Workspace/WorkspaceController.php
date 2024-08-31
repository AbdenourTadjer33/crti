<?php

namespace App\Http\Controllers\Workspace;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Project\ProjectRessource;
use App\Http\Resources\Project\ProjectTaskResource;
use App\Models\Project;

class WorkspaceController extends Controller
{
    public function project(Project $project)
    {
        return Inertia::render('Workspace/project', [
            'project' => $project,
            'links' => [
                [
                    'href' => "/test",
                    "label" => "test"
                ],
                [
                    'href' => "/suggested/versions",
                    "label" => "version suggestions"
                ],
            ],
        ]);
    }

    public function calendar()
    {
        return Inertia::render('Workspace/calendar', []);
    }

    public function kanban(Project $project)
    {
        return Inertia::render('Workspace/kanban', [
            'tasks' => ProjectTaskResource::collection($project->load(['tasks', 'tasks.users'])->tasks)
        ]);
    }
}
