<?php

namespace App\Http\Controllers\Workspace;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Domain;
use App\Models\Nature;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Version\VersionResource;
use App\Http\Resources\Project\ProjectRessource;
use App\Http\Resources\Project\ProjectMemberResource;

class SuggestedVersionController extends Controller
{

    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    public function index(Project $project)
    {
        if ($project->user_id !== $this->user->id || !$project->canHaveNewVersions()) abort(403);

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
                    ->latest()
                    ->get(['id', 'user_id', 'reason', 'created_at', 'updated_at']);

                return VersionResource::collection($versions);
            },
            'suggested_versions_count' => count($project->getVersionMarkedAs('review')),
        ]);
    }

    public function show(Request $request, Project $project)
    {
        if ($project->id !== $this->user->id || !$project->canHaveNewVersions() || !in_array($request->route('version'), $project->getVersionMarkedAs('review'))) return abort(403);

        $versionFn = function () use ($request, $project) {
            $version = $project->versions()->where('id', $request->route('version'))->with('user:id,uuid,first_name,last_name,email')->first();
            $data = unserialize($version->model_data);

            return [
                'id' => $version->id,
                'reason' => $version->reason,
                'creator' => new ProjectMemberResource($version->user),
                'isSuggested' => $version->user->id !== $project->user_id,
                'createdAt' => $version->created_at,
                'data' => $data,
                'natures' => Nature::getNatures()->where('id', data_get($data, 'nature'))->map(fn(Nature $nature) => $nature->only(['id', 'name', 'suggested']))->values(),
                'domains' => Domain::getDomains()->whereIn('id', data_get($data, 'domains'))->map(fn($domain) => $domain->only(['id', 'name', 'suggested']))->values()
            ];
        };

        return Inertia::render('Workspace/version/show', [
            'version' => $versionFn,
            'suggested_versions_count' => count($project->getVersionMarkedAs('review')),
        ]);
    }
}
