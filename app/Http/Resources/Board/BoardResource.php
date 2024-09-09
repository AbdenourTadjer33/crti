<?php

namespace App\Http\Resources\Board;

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
            'id' => $this->id,
            'code' => $this->code,
            'judgment_period' => [
                'from' => $this->judgment_start_date,
                'to' => $this->judgment_end_date,
            ],
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'president' => $this->users->firstWhere('id', $this->user_id)->uuid,
            'decision' => $this->when(!is_null($this->decision), (bool) $this->decision),
            'users' => $this->users->map(function ($user) {
                return [
                    'uuid' => $user->uuid,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'email' => $user->email,
                    'comment' => $user->pivot->comment,
                    'isFavorable' => $user->pivot->is_favorable,
                    'updatedAt' => $user->pivot->updated_at
                ];
            }),
            'project' => [
                'code' => $this->project?->code,
                'name' => $this->project?->name,
            ],

        ];
    }
}
