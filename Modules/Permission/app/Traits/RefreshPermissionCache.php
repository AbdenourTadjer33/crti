<?php

namespace Modules\Permission\Traits;

use Modules\Permission\Models\Permission;
use Modules\Permission\PermissionRegistrar;

trait RefreshPermissionCache
{
    public static function bootRefreshPermissionCache()
    {
        static::saved(function () {
            app(PermissionRegistrar::class)
                ->forgetCachedPermissions();
        });

        static::deleted(function () {
            app(PermissionRegistrar::class)
                ->forgetCachedPermissions();
        });
    }
}
