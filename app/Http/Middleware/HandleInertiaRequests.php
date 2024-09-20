<?php

namespace App\Http\Middleware;

use App\Http\Resources\Auth\UserResource;
use App\Http\Resources\Project\PendingActionResource;
use Closure;
use Inertia\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    protected $guestView = 'guest';

    protected $authView = 'auth';

    public function rootView(Request $request)
    {
        if (Auth::check()) {
            return $this->authView;
        }

        return $this->guestView;
    }

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $pendingActionsFn = function () use ($request) {

            /** @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\PendingAction> */
            $actions = $request->user()->getPendingActions();

            if (!$actions->count()) return false;

            $projects = $actions->where('progressable_type', \App\Models\Project::class);
            $versions = $actions->where('progressable_type', \Modules\Versioning\Models\Version::class);

            $response = [];

            if ($projects->count()) {
                $projects = $projects->load('progressable:id,code,created_at')->map(fn($action) => $action->progressable);
                $response["Projet en cours de création"] = PendingActionResource::collection($projects);
            }

            if ($versions->count()) {
                $response["Version propsé en cours de création"] = $versions->load('progressable');
            }

            return $response;
        };

        $permissionsFn = function () use ($request) {
            /** @var \App\Models\User */
            $user = $request->user();

            return [
                'workspace' => $user->can('access.workspace'),
                'projects' => $user->canAny(['access.projects', 'access-related.projects', 'access-related.members.projects', 'access-related.divisions.projects', 'access-related.members.projects']),
                'boards' => $user->can('access.boards'),
                'control_panel' => $user->can('manage'),
            ];
        };

        return [
            ...parent::share($request),
            'auth' => [
                'user' => fn() => $request->user() ? new UserResource($request->user()) : null,
            ],
            // FLASH MESSAGES
            'alert' => fn() => $request->session()->get('alert'),
            'info' => fn() => $request->session()->get('info'),
            'pendingActions' => Inertia::lazy($pendingActionsFn),
        ];
    }
}
