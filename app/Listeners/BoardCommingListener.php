<?php

namespace App\Listeners;

use App\Models\Board;
use App\Events\BoardComming;
use App\Notifications\BoardCommingNotification;
use Illuminate\Contracts\Queue\ShouldQueueAfterCommit;
use Illuminate\Support\Facades\Notification;

class BoardCommingListener implements ShouldQueueAfterCommit
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(BoardComming $event): void
    {
        $board = Board::query()->where('id', $event->boardId)->first();
        Notification::send($board->users, new BoardCommingNotification($board, $board->project));
    }

    /**
     * Get the number of seconds before the job should be processed.
     */
    public function withDelay(BoardComming $event): int
    {
        return $event->delay;
    }
}
