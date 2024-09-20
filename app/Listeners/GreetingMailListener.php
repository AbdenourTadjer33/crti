<?php

namespace App\Listeners;

use App\Models\User;
use App\Events\GreetingMail;
use App\Notifications\GreetingMailNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class GreetingMailListener implements ShouldQueue
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
    public function handle(GreetingMail $event): void
    {
        $user = User::query()->where('id', $event->userId)->first();

        $user->notify(new GreetingMailNotification($user, $event->password));
    }
}
