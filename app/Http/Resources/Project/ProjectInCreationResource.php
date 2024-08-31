<?php

namespace App\Http\Resources\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectInCreationResource extends JsonResource
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
            'status' => __("status.{$this->status}"),
            'division' => $this->when(!!$this->division, [
                'id' => $this->division?->id,
                'abbr' => $this->division?->abbr,
                'name' => $this->division?->name,
            ]),
            'unit' => $this->when(!!$this->division?->unit, [
                'id' => $this->division->unit->id,
                'abbr' => $this->division->unit->abbr,
                'name' => $this->division->unit->name,
            ]),
            'createdAt' => $this->created_at,
            'lastActivity' => $this->versions->first()?->updated_at,
        ];
    }
}
