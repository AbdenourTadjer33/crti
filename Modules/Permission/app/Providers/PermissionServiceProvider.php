<?php

namespace Modules\Permission\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Blade;
use Illuminate\Foundation\Application;
use Illuminate\Support\ServiceProvider;
use Modules\Permission\PermissionRegistrar;

class PermissionServiceProvider extends ServiceProvider
{
    protected string $moduleName = 'Permission';

    protected string $moduleNameLower = 'permission';

    /**
     * Boot the application events.
     */
    public function boot(): void
    {
        $this->registerCommands();
        $this->registerCommandSchedules();
        $this->registerTranslations();
        $this->registerConfig();
        $this->loadMigrationsFrom(module_path($this->moduleName, 'database/migrations'));

        Gate::before(function (User $user, $ability) {
            return $user->hasPermissionTo($ability);
        });
    }

    /**
     * Register the service provider.
     */
    public function register(): void
    {
        $this->app->singleton(PermissionRegistrar::class);
    }

    
    /**
     * Register commands in the format of Command::class
     */
    protected function registerCommands(): void
    {
        $this->commands([
            \Modules\Permission\Console\GenerateUsePermissionFile::class,
        ]);
    }

    /**
     * Register command Schedules.
     */
    protected function registerCommandSchedules(): void
    {
        // $this->app->booted(function () {
        //     $schedule = $this->app->make(Schedule::class);
        //     $schedule->command('inspire')->hourly();
        // });
    }

    /**
     * Register translations.
     */
    public function registerTranslations(): void
    {
        $langPath = resource_path('lang/modules/' . $this->moduleNameLower);

        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, $this->moduleNameLower);
            $this->loadJsonTranslationsFrom($langPath);
        } else {
            $this->loadTranslationsFrom(module_path($this->moduleName, 'lang'), $this->moduleNameLower);
            $this->loadJsonTranslationsFrom(module_path($this->moduleName, 'lang'));
        }
    }

    /**
     * Register config.
     */
    protected function registerConfig(): void
    {
        $this->publishes([module_path($this->moduleName, 'config/config.php') => config_path($this->moduleNameLower . '.php')], 'config');
        $this->mergeConfigFrom(module_path($this->moduleName, 'config/config.php'), $this->moduleNameLower);
    }

    /**
     * Get the services provided by the provider.
     */
    public function provides(): array
    {
        return [];
    }
}
