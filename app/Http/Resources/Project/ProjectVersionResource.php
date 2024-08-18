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
            'creator' => new ProjectMemberResource($this->user),
            'name' => $this->name,
            'nature' => $this->nature,
            'domains' => $this->domains,
            'description' => $this->description,
            'goals' => $this->goals,
            'methodology' => $this->methodology,
            'is_partner' => !!$this->partner,
            'partner' => [
                'name' => '',
                'email' => '',
                'phone' => '',
            ],
            'timeline' => [
                'from' => $this->date_begin,
                'to' => $this->date_end,
            ],
            'members' => ProjectMemberResource::collection($this->users),
            'tasks' => ProjectTaskResource::collection($this->tasks),
            'resources' => [],
            'resources_crti' => [],
            'resources_partner' => [],
        ];
    }
}
