<?php

namespace App\Http\Resources\Manage\Permission;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DefaultPermissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        [$feature, $action] = array_pad(explode('.', $this->name), 2, null);

        if (!$action) {
            $name = __("permissions.features.{$feature}");
        } else {
            $name = __("permissions.features.{$feature}") . "." . __("permissions.actions.{$action}")["name"];
        }

        return [
            'id' => (string) $this->id,
            'name' => $name,
            'token' => $this->name,
        ];
    }
}
