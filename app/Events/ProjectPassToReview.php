<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectPassToReview
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $projectId;
    public $delay;

    /**
     * Create a new event instance.
     */
    public function __construct($projectId, $delay)
    {
        $this->projectId = $projectId;
        $this->delay = $delay;
    }
}
