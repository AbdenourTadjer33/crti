<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;

class ShareDataWithWorkspace extends HandleInertiaRequests
{
    public function share(Request $request): array
    {
        if (!is_a($request->route('project'), \App\Models\Project::class)) {
            return parent::share($request);
        }

        return [
            ...parent::share($request),
            'can_access_suggested_versions' => fn() => $request->user()->id === $request->route('project')->user_id && $request->route('project')->canHaveNewVersions(),
            'suggested_versions_count' => fn() => count($request->route('project')->getVersionMarkedAs('review')),
        ];
    }
}
