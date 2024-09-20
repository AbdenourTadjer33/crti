<?php

namespace App\Http\Resources\Manage;

use App\Http\Resources\Manage\Permission\DefaultPermissionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
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
            'description' => $this->description,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'usersCount' => $this->whenCounted('users'),
            'permissions' => DefaultPermissionResource::collection($this->whenLoaded('permissions', fn () => $this->permissions)),
        ];
    }
}
