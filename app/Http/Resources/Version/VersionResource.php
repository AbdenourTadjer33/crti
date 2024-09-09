<?php

namespace App\Http\Resources\Version;

use App\Http\Resources\Project\ProjectMemberResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VersionResource extends JsonResource
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
            'user' => new ProjectMemberResource($this->user),
            'reason' => $this->reason,
            'suggested_at' => $this->updated_at,
        ];
    }
}
