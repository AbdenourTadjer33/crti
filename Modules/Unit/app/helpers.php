<?php

use Illuminate\Support\Arr;

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

// if (!function_exists('permissionService')) {
// function permissionService(): \Modules\Permission\Services\PermissionService
// {
// /** @var \Modules\Permission\Services\PermissionService */
// return app(\Modules\Permission\Services\PermissionService::class);
// }
// }

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
        /** @var  \Modules\Permission\PermissionRegistrar::class */
        $permissionRegistrar = app(\Modules\Permission\PermissionRegistrar::class);
        return $permissionRegistrar->isValidPermission($permission) || ( is_array($permission) && $permissionRegistrar->isValidArrayPermission($permission));
    }
}
