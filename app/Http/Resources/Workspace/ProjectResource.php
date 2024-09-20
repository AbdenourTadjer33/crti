<?php

namespace App\Http\Resources\Workspace;

use App\Http\Resources\Project\ProjectMemberResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            '_status' => $this->status,
            'status' => __("status.{$this->status}"),
            'name' => $this->name,
            'timeline' => [
                'from' => $this->date_begin,
                'to' => $this->date_end,
            ],
            'members' => ProjectMemberResource::collection($this->whenLoaded('users')),
            'creator' => $this->whenLoaded("users", fn() => new ProjectMemberResource($this->users->filter(fn($u) => $u->id === $this->user_id)->first())),
            'division' => $this->whenLoaded('division', fn() => [
                'id' => $this->division?->id,
                'abbr' => $this->division?->abbr,
                'name' => $this->division?->name,
            ]),
            'unit' => $this->when('division.unit', fn () => [
                'id' => $this->division->unit->id,
                'abbr' => $this->division->unit->abbr,
                'name' => $this->division->unit->name,
            ]),
            'createdAt' => $this->createdAt
        ];
    }
}
