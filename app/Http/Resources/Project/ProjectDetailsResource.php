<?php

namespace App\Http\Resources\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectDetailsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'status' => __("status.{$this->status}"),
            '_status' => $this->status,
            'name' => $this->name,
            'nature' => $this->whenLoaded('nature', fn() => $this->nature->name),
            'domains' => $this->whenLoaded('domains', fn() => $this->domains->map(fn($domain) => $domain->name)),
            'timeline' => [
                'from' => $this->date_begin,
                'to' => $this->date_end,
            ],
            'description' => $this->description,
            'goals' => $this->goals,
            'methodology' => $this->methodology,
            'partner' => $this->when($this->partner, [
                'organisation' => $this->partner?->organisation,
                'sector' => $this->partner?->sector,
                'contact_name' => $this->partner?->contact_name,
                'contact_post' => $this->partner?->contact_post,
                'contact_phone' => $this->partner?->contact_phone,
                'contact_email' => $this->partner?->contact_email,
            ]),
            'deliverables' => $this->deliverables,
            'estimated_amount' => $this->estimated_amount,
            'creator' => $this->whenLoaded("users", fn() => new ProjectMemberResource($this->users->filter(fn($u) => $u->id === $this->user_id)->first())),
            'members' => ProjectMemberResource::collection($this->whenLoaded('users')),
            'tasks' => ProjectTaskResource::collection($this->whenLoaded('tasks')),
            'existingResources' => $this->whenLoaded('existingResources'),
            'requestedResources' => ProjectRequestedResource::collection($this->whenLoaded('requestedResources')),
            'division' => $this->whenLoaded('division', fn() => [
                'id' => $this->division->id,
                'name' => $this->division->name,
                'abbr' => $this->division->abbr,
            ]),
            'unit' => $this->when($this->division?->unit, fn() => [
                'id' => $this->division->unit->id,
                'name' => $this->division->unit->name,
                'abbr' => $this->division->unit->abbr,
            ]),
            'createdAt' => $this->created_at,
        ];
    }
}
