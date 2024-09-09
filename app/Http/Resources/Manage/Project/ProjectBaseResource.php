<?php

namespace App\Http\Resources\Manage\Project;

use App\Http\Resources\DivisionBaseResource;
use App\Http\Resources\UserBaseResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectBaseResource extends JsonResource
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
            'creator' => new UserBaseResource($this->whenLoaded('user')),
            'division' => new DivisionBaseResource($this->whenLoaded('division')),
            'versionsCount' => $this->whenCounted('versions'),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
