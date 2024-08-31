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
            'status' => __("status.{$this->status}"),
            $this->mergeWhen($this->status !== "creation", [
                'name' => $this->name,
                'nature' => $this->nature?->name,
                'domains' => $this->domains?->map(fn($domain) => $domain->name),
                'timeline' => [
                    'from' => $this->date_begin,
                    'to' => $this->date_end,
                ],
                'creator' => $this->when(!!$this->user, new ProjectMemberResource($this->user)),
                'members' => ProjectMemberResource::collection($this->whenLoaded('users')),
                'tasks' => ProjectTaskResource::collection($this->whenLoaded('tasks')),
            ]),
            'division' => $this->when(!!$this->division, [
                'id' => $this->division?->id,
                'name' => $this->division?->name,
            ]),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
