<?php

namespace App\Listeners;

use App\Models\Project;
use App\Events\Project\ProjectCreated;
use Illuminate\Contracts\Queue\ShouldQueue;

class ProjectCreatedListener implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct() {}

    /**
     * Handle the event.
     */
    public function handle(ProjectCreated $event): void
    {
        $project = Project::query()->where('id', $event->projectId)->first();


        
    }
}
