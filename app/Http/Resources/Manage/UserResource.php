<?php

namespace App\Http\Resources\Manage;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->first_name . ' ' . $this->last_name,
            'title' => $this->title,
            'dob' => $this->dob,
            'sex' => $this->sex === "male" ? "Homme" : "Femme",
            'email' => $this->email,
            // 'canAccessApplication' => $this->hasPermissionTo('application.access'),
            // 'canAccessApplication' => $this->when(!is_null($this->canAccessApplication), fn () => (bool) $this->canAccessApplication),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'lastActivity' => $this->last_activity,

            // 'status' => $this->status,
            // 'divisions' => UserDivisionsResource::collection($this->whenLoaded('divisions')),
            // 'division' => $this->whenPivotLoaded('division_user', fn() => [
            // 'grade' => $this->pivot->grade->name,
            // 'addedAt' => $this->pivot->created_at,
            // ]),
            // 'board' => $this->whenPivotLoaded('board_user', fn() => [
            // 'addedAt' => $this->pivot->created_at,
            // ]),
        ];
    }
}
