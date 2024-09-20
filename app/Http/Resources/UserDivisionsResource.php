<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserDivisionsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...(new DivisionBaseResource($this))->toArray($request),
            'grade' => [
                'id' => (string) $this->pivot->grade->id,
                'name' => $this->pivot->grade->name,
            ],
            'addedAt' => $this->pivot->created_at,
        ];
    }
}
