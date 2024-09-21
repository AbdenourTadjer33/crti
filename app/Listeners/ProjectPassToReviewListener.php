<?php

namespace App\Listeners;

use App\Models\Project;
use App\Events\ProjectPassToReview;
use Illuminate\Support\Facades\Notification;
use App\Notifications\Project\ProjectPassedToReviewNotification;
use Illuminate\Contracts\Queue\ShouldQueueAfterCommit;

class ProjectPassToReviewListener implements ShouldQueueAfterCommit
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
    }

    /**
     * Handle the event.
     */
    public function handle(ProjectPassToReview $event): void
    {
        $project = Project::query()->where('id', $event->projectId)->first();
        Notification::send($project->users, new ProjectPassedToReviewNotification($project));
    }

    /**
     * Get the number of seconds before the job should be processed.
     */
    public function withDelay(ProjectPassToReview $event): int
    {
        return $event->delay;
    }
}
