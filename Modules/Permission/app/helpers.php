<?php

use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

if (!function_exists('keys_exists')) {
    /**
     * @param array $array
     * @param string $keys
     * @return bool
     */
    function keys_exists(array $array, ...$keys): bool
    {
        foreach (Arr::flatten($keys) as $key) {
            if (!key_exists($key, $array)) return false;
        }

        return true;
    }
}

if (!function_exists('resolvePermissionName')) {
    function resolvePermissionName($permission): array|false
    {
        return app(\Modules\Permission\PermissionRegistrar::class)
            ->resolvePermissionName($permission);
    }
}

if (!function_exists('isValidPermission')) {
    function isValidPermission(array|string $permission): bool
    {
        $permissionRegistrar = app(\Modules\Permission\PermissionRegistrar::class);
        return $permissionRegistrar->isValidPermission($permission) || (is_array($permission) && $permissionRegistrar->isValidArrayPermission($permission));
    }
}

if (!function_exists('resolvePermission')) {
    function resolvePermission($permission): Collection|False
    {
        return app(\Modules\Permission\PermissionRegistrar::class)
            ->resolvePermission($permission);
    }
}
