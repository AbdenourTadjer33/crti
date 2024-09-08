<?php

namespace App\Http\Controllers\Workspace;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Project\ProjectRessource;
use App\Http\Resources\Version\VersionResource;

class SuggestedVersionController extends Controller
{

    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    public function index(Request $request)
    {
        /** @var \App\Models\Project */
        $project = $this->user->projects()->where('code', $request->route('project'))->first();

        if (!$project || !$project->canHaveNewVersions()) abort(403);

        return Inertia::render('Workspace/version/page', [
            'project' => fn() => new ProjectRessource($project),
            'versions' => function () use ($project) {
                $versionsIds = $project->getVersionMarkedAs('review');

                if (!$versionsIds) {
                    return [];
                }

                $versions =  $project->versions()
                    ->whereIn('id', $versionsIds)
                    ->with(['user:id,uuid,first_name,last_name,email'])
                    ->get(['id', 'user_id', 'reason', 'created_at', 'updated_at']);

                return VersionResource::collection($versions);
            },
            'suggested_versions_count' => count($project->getVersionMarkedAs('review')),
        ]);
    }

    public function show(Request $request)
    {
        /** @var \App\Models\Project */
        $project = $this->user->projects()->where('code', $request->route('project'))->first();

        if (!$project || !$project->canHaveNewVersions() || !in_array($request->route('version'), $project->getVersionMarkedAs('review'))) {
            return abort(403);
        };

        return Inertia::render('Workspace/version/show', [
            'version' => function () use ($project, $request) {
                return $project->versions()->where('id', $request->route('version'))->with(['user:id,uuid,first_name,last_name,email'])->first();
            },
            'project' => fn() => new ProjectRessource($project),
            'suggested_versions_count' => count($project->getVersionMarkedAs('review')),
        ]);
    }
}
