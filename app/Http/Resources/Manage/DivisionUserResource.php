<?php

namespace App\Http\Resources\Manage;

use App\Http\Resources\UserBaseResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DivisionUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            ...(new UserBaseResource($this))->toArray($request),
            'grade' => $this->whenPivotLoaded('division_user', fn() => [
                'id' => (string) $this->pivot->grade->id,
                'name' => $this->pivot->grade->name,
                'addedAt' => $this->pivot->grade->created_at,
            ]),
        ];
    }
}
