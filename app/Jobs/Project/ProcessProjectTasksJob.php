<?php

namespace App\Jobs\Project;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class ProcessProjectTasksJob implements ShouldQueue
{
    use Queueable;

    protected $projectId;

    /**
     * Create a new job instance.
     */
    public function __construct($projectId)
    {
        $this->projectId = $projectId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $project = Project::query()->where('id', $this->projectId)->first();

        $now = now();

        /**
         * Get tasks that are begginig or ending
         *
         * @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task>
         */
        $tasks = $project->tasks()->getQuery()->with('users')
            ->where('date_begin', $now->toDateString())
            ->orWhere('date_end', $now->toDateString())
            ->whereIn('status', ['todo', 'progress'])
            ->get();

        $begins = $tasks->where('date_begin', $now->toDateString())->where('status', 'todo');

        if (count($begins)) {
            Task::query()->whereIn('id', $begins->pluck('id'))->update(['status' => 'progress']);
        }

        $ends = $tasks->where('date_begin', $now->toDateString())->where('status', 'progress');

        if (count($ends)) {
            Task::query()->whereIn('id', $ends->pluck('id'))->update(['status', 'done']);
        }

        $task = $project->tasks()->getQuery()
            ->where(function ($query) use ($now) {
                $query->orWhere('date_begin', '>', $now->toDateString());
                $query->orWhere('date_end', '>', $now->toDateString());
            })->first();

        if ($task) {
            $date_begin = now()->parse($task->date_begin);
            $date_end = now()->parse($task->date_end);

            $delay = $date_begin->isFuture() && $date_end->isFuture()
                ? ($date_end->lt($date_begin) ? $date_end : $date_begin)
                : ($date_begin->isFuture() ? $date_begin : $date_end);


            if ($delay) {
                static::dispatch($this->projectId)->delay($now->diffInSeconds($delay));
            }
        }
    }

    protected function getClosestFutureDate(\Illuminate\Support\Carbon $dateBegin, \Illuminate\Support\Carbon $dateEnd)
    {
        return $dateBegin->isFuture() && $dateEnd->isFuture()
            ? ($dateBegin->lt($dateBegin) ? $dateEnd : $dateBegin)
            : ($dateBegin->isFuture() ? $dateBegin : $dateEnd);
    }
}
