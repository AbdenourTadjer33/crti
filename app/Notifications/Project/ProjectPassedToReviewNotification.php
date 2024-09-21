<?php

namespace App\Notifications\Project;

use App\Models\User;
use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ProjectPassedToReviewNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Project $project
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(User $notifiable): array
    {
        return $notifiable->notifyVia();
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(User $notifiable): MailMessage
    {
        return (new MailMessage)->markdown('mail.project-passed-to-review', [
            'user' => $notifiable,
            'project' => $this->project,
        ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(User $notifiable): array
    {
        return [
            'title' => 'Projet passé a l\'examen',
            'message' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis officiis, ducimus impedit eligendi minus, veniam architecto fugiat nulla molestiae quasi et, maiores ipsa dolores accusamus! Consequuntur, laboriosam ipsam. Porro, hic!',
            'project' => [
                'code' => $this->project->code,
                'name' => $this->project->name,
            ],
        ];
    }

    /**
     * Determine if the notification should be sent.
     */
    public function shouldSend(User $notifiable): bool
    {
        return $notifiable->hasPermissionTo('application.access');
    }
}
