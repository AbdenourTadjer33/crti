<?php

namespace App\Http\Middleware;

use App\Http\Resources\Auth\UserResource;
use Closure;
use Inertia\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        return [
            ...parent::share($request),
            'auth' => [
                'user' => fn () => $request->user() ? new UserResource($request->user()) : null,
            ],
            'flash' => [
                'alert' => fn () => $request->session()->get('alert'),
            ],
            'locale' => fn () => app()->getLocale(),
        ];
    }
}
