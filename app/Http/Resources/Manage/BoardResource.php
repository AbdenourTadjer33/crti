<?php

namespace App\Http\Resources\Manage;

use App\Http\Resources\Project\ProjectMemberResource;
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
            'code' => $this->code,
            'judgment_period' => [
                'from' => $this->judgment_start_date,
                'to' => $this-> judgment_end_date,
            ],
            'users' => ProjectMemberResource::collection($this->whenLoaded('users')),
            'president' => $this->users->firstWhere('id', $this->user_id)->uuid,
            'project' => [
                'code' => $this->project->code,
                'name' => $this->project->name,
            ],
            'decision' => $this->when(!is_null($this->decision), (bool) $this->decision),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
