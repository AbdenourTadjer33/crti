<?php

namespace App\Http\Resources\Manage;

use App\Http\Resources\UserDivisionsResource;
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
            'dob' => $this->dob,
            'sex' => $this->sex,
            'status' => $this->status,
            'email' => $this->email,
            'isEmailVerified' => (bool) $this->email_verified_at,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'deletedAt' => $this->deleted_at,
            'divisions' => UserDivisionsResource::collection($this->whenLoaded('divisions')),
            'division' => $this->whenPivotLoaded('division_user', fn () => [
                'grade' => $this->pivot->grade->name,
                'addedAt' => $this->pivot->created_at,
            ]),
            'board' => $this->whenPivotLoaded('board_user', fn () => [
                'addedAt' => $this->pivot->created_at,
            ]),
        ];
    }
}
