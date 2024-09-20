<?php

namespace App\Providers;

use App\Services\AuxDataService;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Resources\Json\JsonResource;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(AuxDataService::class, function () {
            return new AuxDataService;
        });

        $this->app->singleton(\App\Services\Project\Project::class, function () {
            return new \App\Services\Project\Project;
        });

        $this->app->singleton(\App\Services\Permission\PermissionService::class, function () {
            return new \App\Services\Permission\PermissionService(\Illuminate\Support\Facades\Storage::json('data/permission/params.json'));
        });

        if ($this->app->environment('local')) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();
    }
}
