<?php

namespace App\Jobs\Project;

use App\Models\Project;
use App\Notifications\Project\ProjectStatusUpdated;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Notification;

class UpdateProjectStatusJob implements ShouldQueue
{
    use Queueable;

    protected string $status;
    protected string $projectId;

    /**
     * Create a new job instance.
     */
    public function __construct(string $projectId, string $status)
    {
        $this->projectId = $projectId;
        $this->status = $status;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $project = Project::with('user:id,uuid,first_name,last_name,email,last_activity')->where('id', $this->projectId)->first();
        $project->update(['status' => $this->status]);

        Notification::send($project->user, new ProjectStatusUpdated($project));

    }
}
