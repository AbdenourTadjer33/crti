<?php

namespace App\Http\Resources\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectVersionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'nature' => (string) $this->nature->id,
            'domains' => $this->domains->map(fn($domain) => (string) $domain->id),
            'timeline' => [
                'from' => $this->date_begin,
                'to' => $this->date_end,
            ],
            'description' => $this->description,
            'goals' => $this->goals,
            'methodology' => $this->methodology,
            'is_partner' => !!$this->partner,
            'partner' => [
                'organisation' => $this?->partner?->organisation ?? "",
                'sector' => $this?->partner?->sector ?? "",
                'contact_name' => $this?->partner?->contact_name ?? "",
                'contact_post' => $this?->partner?->contact_post ?? "",
                'contact_phone' => $this?->partner?->contact_phone ?? "",
                'contact_email' => $this?->partner?->contact_email ?? "",
            ],
            'deliverables' => $this->deliverables,
            'estimated_amount' => $this->estimated_amount,
            'creator' => new ProjectMemberResource($this->user),
            'members' => ProjectMemberResource::collection($this->users),
            'tasks' => $this->tasks->map(fn($task) => [
                'name' => $task->name,
                'description' => $task->description,
                'timeline' => [
                    'from' => $task->date_begin,
                    'to' => $task->date_end
                ],
                'priority' => $task->priority,
                'users' => $task->users->map(fn($user) => $user->uuid),
            ]),
            'resources' => $this->existingResources,
            'resources_crti' => $this->requestedResources->filter(fn($resource) => $resource->by_crti)->values()->map(fn($resource) => [
                'name' => $resource->name,
                'description' => $resource->description ?? "",
                'price' => $resource->price,
            ]),
            'resources_partner' => $this->requestedResources->filter(fn($resource) => !$resource->by_crti)->values()->map(fn($resource) => [
                'name' => $resource->name,
                'description' => $resource->description ?? "",
                'price' => $resource->price,
            ]),
        ];
    }
}
