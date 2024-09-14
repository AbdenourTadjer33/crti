<?php

namespace App\Http\Resources\Manage;

use App\Http\Resources\UserDivisionsResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DivisionResource extends JsonResource
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
            'abbr' => $this->abbr,
            'webpage' => $this->webpage,
            'description' => $this->description,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'users' => DivisionUserResource::collection($this->whenLoaded('users'))

        ];
    }
}
