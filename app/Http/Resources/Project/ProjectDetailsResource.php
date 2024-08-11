<?php

namespace App\Http\Resources\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectDetailsResource extends JsonResource
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
            'name' => $this->name,
            'nature' => $this->nature,
            'domains' => $this->domains,
            'timeline' => [
                'from' => $this->date_begin,
                'to' => $this->to,
            ],
            'description' => $this->description,
            'goals' => $this->goals,
            'methodology' => $this->methodology,
            'creator' => $this->when(!!$this->user, new ProjectMemberResource($this->user))
        ];
    }
}
