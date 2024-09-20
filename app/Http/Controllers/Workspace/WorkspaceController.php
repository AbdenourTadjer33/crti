<?php

namespace App\Http\Controllers\Workspace;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\Project\ProjectResource;
use App\Http\Resources\Project\ProjectDetailsResource;
use App\Services\Project\Metrics as ProjectMetrics;

class WorkspaceController extends Controller
{
    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    public function project(Project $project, ProjectMetrics $projectMetrics)
    {

        $versionsFn = function () use ($project) {
            $versionIds = [
                $project->getVersionMarkedAs('main'),
                ...$project->getVersionMarkedAs('archived'),
                ...$project->getVersionMarkedAs('previous')
            ];

            $versions = $project->versions()
                ->with('user:id,uuid,first_name,last_name,email')
                ->whereIn('id', $versionIds)
                ->latest()->get(['id', 'reason', 'user_id', 'created_at', 'updated_at']);

            return $versions;
        };

        $statisticsFn = function () use ($project) {
            $taskCounts = $project->tasks()
                ->select('status', DB::raw('count(*) as total'))
                ->groupBy('status')
                ->get();

            // Initialize variables for the metrics
            $totalTasks = 0;
            $doneTasks = 0;
            $progressTasks = 0;

            // Iterate through the result and calculate total, completed, and pending tasks
            foreach ($taskCounts as $taskCount) {
                $totalTasks += $taskCount->total;

                if ($taskCount->status === 'done') {
                    $doneTasks = $taskCount->total;
                }

                if ($taskCount->status === 'progress') {
                    $progressTasks += $taskCount->total;
                }
            }

            // Calculate the completion rate
            $completionRate = $totalTasks > 0 ? ($doneTasks / $totalTasks) * 100 : 0;

            // Return the metrics
            return [
                'totalTasks' => $totalTasks,
                'doneTasks' => $doneTasks,
                'progressTasks' => $progressTasks,
                'taskCompletionRate' => $completionRate,
            ];
        };

        $metricsFn = function () use ($project, $statisticsFn, $projectMetrics) {
            $project->load('tasks:id,project_id,status,date_begin,date_end,real_start_date,real_end_date',);

            return [
                'tasks' => $statisticsFn(),
                'project' => $projectMetrics->timelineMetrics($project)
            ];
        };


        return Inertia::render('Workspace/project', [
            'project' => fn() => new ProjectDetailsResource($project->load('nature', 'domains', 'users', 'partner')),
            'versions' => $versionsFn,
            'metrics' => $metricsFn,
        ]);
    }
}

// 'project' => [...$project->load('versions:id,versionable_id,versionable_type,reason,created_at,updated_at')->toArray(), 'version_info' => $project->version_info],
