<?php

namespace App\Jobs;

use App\Enums\TaskStatus;
use App\Enums\ProjectStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class ProcessTasks implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $now = now();

        $projects = \App\Models\Project::query()
            ->where('status', ProjectStatus::pending->name)
            ->whereHas('tasks', fn($query) => $query->where('status', TaskStatus::todo->name)->where('date_begin', '<=', $now->toDateString()))
            ->with(['tasks' => fn($query) => $query->where('status', TaskStatus::todo->name)->where('date_begin', '<=', $now->toDateString())])
            ->get();

        foreach ($projects as $project) {
            /** @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task> */
            $tasks = $project->tasks;

            DB::transaction(function () use ($tasks, $now) {
                \App\Models\Task::query()->whereIn('id', $tasks->pluck('id'))->update([
                    'status' => TaskStatus::progress->name,
                    'real_start_date' => $now->toDateString(),
                ]);

                $histories = [];

                foreach ($tasks as $task) {
                    $histories[] = [
                        'task_id' => $task->id,
                        'old_status' => TaskStatus::todo->name,
                        'new_status' => TaskStatus::progress->name,
                    ];
                }

                DB::table('task_status_histories')->insert($histories);
            });
        }
    }
}
