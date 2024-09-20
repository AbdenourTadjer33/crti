<?php

namespace App\Services\Project;

use App\Enums\TaskStatus;

class TaskMetrics
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getTimelineMetrics($tasks)
    {
        $totalDuration = 0;
        $elapsedDuration = 0;
        $remainingDuration = 0;
        $completedDuration = 0;

        foreach ($tasks as $task) {
            $now = now();
            $endDate = now()->parse($task->date_begin);
            $startDate = now()->parse($task->start_date);

            // Calculate durations
            $taskDuration = $endDate->diffInDays($startDate);
            $totalDuration += $taskDuration;

            if ($task->status === TaskStatus::done->name) {
                $completedDuration += $taskDuration;
            } else {
                if ($now->lessThan($endDate)) {
                    $elapsedDuration += $now->diffInDays($startDate);
                    $remainingDuration += $endDate->diffInDays($now);
                } else {
                    $elapsedDuration += $taskDuration;
                }
            }
        }

        // Calculate progress percentage
        $progressPercentage = $totalDuration > 0 ? ($completedDuration / $totalDuration) * 100 : 0;

        return [
            'totalDuration' => $totalDuration,
            'elapsedDuration' => $elapsedDuration,
            'remainingDuration' => $remainingDuration,
            'completedDuration' => $completedDuration,
            'progressPercentage' => $progressPercentage,
        ];
    }
}
