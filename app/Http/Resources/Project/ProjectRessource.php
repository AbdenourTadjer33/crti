<?php

namespace App\Http\Resources\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectRessource extends JsonResource
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
            '_status' => $this->status,
            'status' => __("status.{$this->status}"),
            'name' => $this->name,
            'nature' => $this->whenLoaded('nature', $this->nature->name),
            'domains' => $this->whenLoaded('domains', fn() => $this->domains->map(fn($domain) => $domain->name)),
            'timeline' => [
                'from' => $this->date_begin,
                'to' => $this->date_end,
            ],
            'creator' => $this->whenLoaded('user', new ProjectMemberResource($this->user)),
            'members' => ProjectMemberResource::collection($this->whenLoaded('users')),
            'tasks' => ProjectTaskResource::collection($this->whenLoaded('tasks')),
            'division' => $this->whenLoaded('division', fn() => [
                'id' => $this->division?->id,
                'abbr' => $this->division?->abbr,
                'name' => $this->division?->name,
            ]),
            'unit' => $this->when('division.unit', fn() => [
                'id' => $this->division->unit->id,
                'abbr' => $this->division->unit->abbr,
                'name' => $this->division->unit->name,
            ]),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
