<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use App\Http\Resources\UserBaseResource;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, \App\Models\User[]>
     */
    public function toArray(Request $request): array
    {
        return [
            ...(new UserBaseResource($this))->toArray($request),
            $this->mergeWhen($request->routeIs('profile.show'), fn () => [
                'firstName' => $this->first_name,
                'lastName' => $this->last_name,
                'dob' => $this->dob,
                'sex' => $this->sex,
            ]),
            'isEmailVerified' => (bool) $this->email_verified_at,
        ];
    }
}
