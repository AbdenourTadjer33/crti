<?php

namespace App\Jobs\Project;

use App\Models\Project;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

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
        Project::query()->where('id', $this->projectId)->update(['status' => $this->status]);
    }
}
