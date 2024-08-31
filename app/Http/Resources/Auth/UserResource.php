<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, \App\Models\User[]>
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->first_name . ' ' . $this->last_name,
            'email' => $this->email,
            'isEmailVerified' => (bool) $this->email_verified_at,
            'status' => $this->status,
            'picture' => $this->picture,
            // 'permissions' => $this->getDirectPermissions()->toArray(),
        ];
    }
}
