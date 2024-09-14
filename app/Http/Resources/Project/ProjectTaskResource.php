<?php

namespace App\Http\Resources\Project;

use App\Enums\TaskStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectTaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'status' => __("status.{$this->status}"),
            '_status' => $this->status,
            'description' => $this->description,
            'timeline' => [
                'from' => $this->date_begin,
                'to' => $this->date_end,
            ],
            'realTimeline' => $this->when($this->status !== TaskStatus::todo->name, fn() => [
                'from' => $this->real_start_date,
                'to' => $this->real_end_date,
            ]),
            $this->mergeWhen($this->status === TaskStatus::suspended->name, fn() => [
                'suspendedAt' => $this->suspended_at,
                'suspensionReason' => $this->suspension_reason,
            ]),
            $this->mergeWhen($this->status === TaskStatus::canceled->name, fn() => [
                'canceledAt' => $this->canceled_at,
                'cancellationReason' => $this->cancellation_reason,
            ]),
            'priority' => $this->priority,
            'users' => ProjectMemberResource::collection($this->whenLoaded('users')),
        ];
    }
}
