<?php

namespace App\Http\Resources\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectTasksResource extends JsonResource
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
            'timeline' => [
                'from' => $this->date_begin,
                'to' => $this->date_end,
            ],
            'description' => $this->description,
            'result' => $this->result,
            'priority' => $this->priority,
            'users' => ProjectMembersResource::collection($this->whenLoaded('users')),
        ];
    }
}
