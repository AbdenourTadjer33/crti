<?php

namespace App\Http\Resources\Manage;

use App\Http\Resources\Project\ProjectRessource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BoardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'start-date' => $this->start_date,
            'end_date' => $this->end_date,
            'description' => $this->description,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'users' => UserResource::collection($this->whenLoaded('users')),
            'userCount' => $this->when($this->users_count !== null, $this->users_count),
            'projects' => ProjectRessource::collection($this->whenLoaded('projects')),
            'ProjectCount' => $this->when($this->projects_count !== null, $this->projects_count),
        ];
    }
}
