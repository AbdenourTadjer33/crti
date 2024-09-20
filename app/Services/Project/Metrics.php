<?php

namespace App\Services\Project;

use App\Enums\ProjectStatus;
use App\Enums\TaskStatus;
use Carbon\Carbon;

class Metrics
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function timelineMetrics(\App\Models\Project $project)
    {
        $now = now();
        $start = now()->parse($project->date_begin);
        $end = now()->parse($project->date_end);


        // Calculate total project duration
        $totalProjectDuration = $start->diffInDays($end);
        // $duration = $start->diffForHumans($end);

        // Calculate elapsed and remaining durations for the project
        $elapsedDuration = $now->lessThan($start) ? 0 : $start->diffInDays($now);
        $remainingDuration = $now->greaterThan($end) ? 0 : $now->diffInDays($end);

        $totalTaskDuration = 0;
        $completedTaskDuration = 0;

        foreach ($project->tasks as $task) {
            $taskStartDate = Carbon::parse($task->real_start_date ?? $task->date_begin);
            $taskEndDate = Carbon::parse($task->real_end_date ?? $task->date_end);
            $taskDuration = $taskStartDate->diffInDays($taskEndDate);

            $totalTaskDuration += $taskDuration;

            if ($task->status === TaskStatus::done->name) {
                $completedTaskDuration += $taskDuration;
            }
        }

        // Calculate project completion percentage
        $completionPercentage = $totalTaskDuration > 0 ? ($completedTaskDuration / $totalTaskDuration) * 100 : 0;

        return [
            'totalProjectDuration' => $totalProjectDuration,
            'elapsedDuration' => $elapsedDuration,
            'remainingDuration' => $remainingDuration,
            'completionPercentage' => round($completionPercentage, 2),
        ];
    }
}
