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
            'uuid' => $this->uuid,
            'name' => $this->first_name . ' ' . $this->last_name,
            'email' => $this->email,
            'division' => $this->whenPivotLoaded('division_user', fn() => [
                'grade' => $this->pivot->grade->name,
                'addedAt' => $this->pivot->created_at,
            ]),
        ];
    }
}
