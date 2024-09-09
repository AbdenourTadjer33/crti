<?php

namespace App\Events\Project;

use Illuminate\Broadcasting\InteractsWithSockets;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectAccepted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $projectId;

    /**
     * Create a new event instance.
     */
    public function __construct($projectId) {
        $this->projectId = $projectId;
    }
}
