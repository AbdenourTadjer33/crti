<?php

namespace Modules\ManageApp\Transformers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'name' => $this->lastName . ' ' . $this->firstName,
            'dob' => $this->dob,
            'sex' => $this->sex,
            'status' => $this->status,
            'email' => $this->email,
            'isEmailVerified' => (bool) $this->email_verified_at,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'deletedAt' => $this->deleted_at,
        ];
    }
}
