<?php

namespace App\Http\Resources\Manage;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UnitResource extends JsonResource
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
            'description' => $this->description,
            'address' => $this->address,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'divisions' => DivisionResource::collection($this->whenLoaded('divisions')),
            'divisionCount' => $this->when($this->divisions_count !== null, $this->divisions_count),
        ];
    }
}
