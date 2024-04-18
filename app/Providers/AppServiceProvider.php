<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::before(function(User $user, $abilities) {
            // dd($user, $abilities);
            return false;
        });

        Gate::define('create', function (?User $user) {
            return true;
        });

        Gate::define('update', function (?User $user) {
            return true;
        });
    }
}
