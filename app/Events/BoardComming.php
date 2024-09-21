<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BoardComming
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $boardId;
    public $delay;

    /**
     * Create a new event instance.
     */
    public function __construct($boardId, $delay)
    {
        $this->boardId = $boardId;
        $this->delay = $delay;
    }
}
