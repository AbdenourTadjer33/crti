<?php

namespace App\Http\Resources\Board;

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
            'judgment_period' => [
                'from' => $this->judgment_start_date,
                'to' => $this->judgment_end_date,
            ],
            'description' => $this->description,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'president' => [
                'id' => $this->user->id,
                'uuid' => $this->user->uuid,
                'name' => $this->user->last_name . ' ' . $this->user->first_name,
            ],
            // 'users' => UserResource::collection($this->whenLoaded('users')),
            'userCount' => $this->when($this->users_count !== null, $this->users_count),
            'project' => [
                'code' => $this->project?->code,
                'name' => $this->project?->name,
                'status' => $this->project?->status,
                'Nature' => $this->project->nature
            ],

        ];
    }
}
