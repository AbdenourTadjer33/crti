<?php

namespace App\Http\Resources\Manage\Board;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Project\ProjectMemberResource;

class BoardOnEditResource extends JsonResource
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
                'to' => $this->judgment_end_date,
            ],
            'users' => ProjectMemberResource::collection($this->whenLoaded('users')),
            'president' => $this->users->firstWhere('id', $this->user_id)->uuid,
            'project' => [
                'code' => $this->project->code,
                'name' => $this->project->name,
                'status' => $this->project->status,
                'nature' => $this->project->nature->name,
                'division' => [
                    'id' => $this->project->division->id,
                    'abbr' => $this->project->division->abbr,
                    'name' => $this->project->division->name
                ],
                'unit' => [
                    'id' => $this->project->division->unit->id,
                    'abbr' => $this->project->division->unit->abbr,
                    'name' => $this->project->division->unit->name,
                ],
                'creator' => [
                    'uuid' => $this->user->uuid,
                    'name' => $this->user->first_name . " " . $this->user->last_name,
                    'email' => $this->user->email,
                ],
                'createdAt' => $this->project->created_at,
            ],
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,


        ];
    }
}
