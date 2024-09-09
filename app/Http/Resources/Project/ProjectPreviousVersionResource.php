<?php

namespace App\Http\Resources\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectPreviousVersionResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */

    public function toArray(Request $request): array
    {
        return [
            'reason' => $this->reason,
            'creator' => new ProjectMemberResource($this->user),
            'createdAt' => $this->created_at,
        ];
    }
}
