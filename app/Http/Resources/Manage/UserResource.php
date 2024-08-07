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
            'name' => $this->last_name . ' ' . $this->first_name,
            'dob' => $this->dob,
            'sex' => $this->sex,
            'status' => $this->status,
            'email' => $this->email,
            'isEmailVerified' => (bool) $this->email_verified_at,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'deletedAt' => $this->deleted_at,
            'division' => $this->whenPivotLoaded('division_user', fn () => [
                'grade' => $this->pivot->grade,
                'addedAt' => $this->pivot->created_at,
            ]),
        ];
    }
}
