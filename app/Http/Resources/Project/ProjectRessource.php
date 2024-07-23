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
                'nature' => $this->nature,
                'domains' => $this->domains,
                'members' => $this->users->map(fn ($user) => [
                    'uuid' => $user->uuid,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'isCreator' => $user->id === $this->user_id,
                ])
            ]),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'division' => [
                'id' => $this->division?->id,
                'name' => $this->division?->name,
            ],
        ];
    }
}
