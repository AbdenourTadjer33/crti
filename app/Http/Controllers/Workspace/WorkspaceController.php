<?php

namespace App\Http\Controllers\Workspace;

use App\Enums\ProjectStatus;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use App\Http\Controllers\Controller;

class WorkspaceController extends Controller
{
    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    public function project(Project $project)
    {
        // if ($project->user_id === $this->user->id) $this->shareWithCreator($project);

        return Inertia::render('Workspace/project', [
            'project' => [...$project->load('versions:id,versionable_id,versionable_type,reason,created_at,updated_at')->toArray(), 'version_info' => $project->version_info],
        ]);
    }

    // protected function shareWithCreator(Project $project)
    // {
        // if ($project->canHaveNewVersions()) {
            // Inertia::share('suggested_versions_count', count($project->getVersionMarkedAs('review')));
        // }
    // }
}
