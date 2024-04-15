<?php

namespace Modules\Permission;

use Illuminate\Support\Arr;
use Modules\Permission\Models\Role;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Collection;
use Modules\Permission\Models\Permission;

use function PHPUnit\Framework\isNull;

class PermissionRegistrar
{
    protected $cache;
    protected $cacheExpirationTime;
    protected string $cacheKey;

    /** @var Object|string|null */
    protected $permissionClass;

    /** @var Object|string|null */
    protected $roleClass;

    /** @var Collection|array|null */
    public $permissions;

    /** @var Collection|array|null */
    public $roles;


    public function __construct()
    {
        $this->permissionClass = config('permission.models.permission');
        $this->roleClass = config('permission.models.role');
        $this->cacheKey = config('permission.cache.key');
        $this->cacheExpirationTime = config('permission.cache.expiration_time') ?: \DateInterval::createFromDateString('24 hours');
        $this->cache = Cache::store();
        // $this->loadPermissions();
    }

    public function getPermissionClass()
    {
        return $this->permissionClass;
    }

    private function setPermissions()
    {
        $this->loadPermissions();
    }

    private function loadPermissions(): void
    {
        ['permissions' => $permissions, 'roles' => $roles] = $this->cache->remember(
            $this->cacheKey,
            $this->cacheExpirationTime,
            fn () => [
                'permissions' => $this->getSerializedPermissionForCache(),
                'roles' => $this->getSerializedRoleForCache(),
            ]
        );

        $this->permissions = $this->hydratePermissionCollection($permissions);
        $this->roles = $this->hydrateRoleCollection($roles);
    }

    public function forgetCachedPermissions(): bool
    {
        $this->permissions = null;
        $this->roles = null;
        return $this->cache->forget($this->cacheKey);
    }

    private function getSerializedPermissionForCache(): array
    {
        return $this->permissionClass::get()->toArray();
    }

    private function getSerializedRoleForCache(): array
    {
        return Role::with('rolePermission')->get()->map(function ($role) {
            $role->permission_ids = $role->rolePermission->pluck('permission_id')->toArray();
            unset($role->rolePermission);
            return $role;
        })->toArray();
    }

    private function hydratePermissionCollection(array $permissions): Collection
    {
        $permissionInstance = new ($this->permissionClass)();

        return Collection::make(array_map(
            fn ($item) => $permissionInstance->newInstance([], true)
                ->setRawAttributes($item, true),
            $permissions
        ));
    }

    private function hydrateRoleCollection(array $roles): Collection
    {
        // $roleInstance = new ($this->roleClass)();
        $roleInstance = new Role;

        return Collection::make(array_map(
            function ($item) use ($roleInstance) {
                $roleAttribute = Arr::except($item, ['permission_ids']);
                $role = $roleInstance->newInstance([], true)
                    ->setRawAttributes($roleAttribute, true)
                    ->setRelation('permissions', $this->getPermissions($item['permission_ids']));

                return $role;
            },
            $roles
        ));
    }

    public function getPermissions(?array $arg = null, bool $must_have_arg = false): Collection
    {

        if (!$this->permissions) {
            $this->setPermissions();
        }

        if (!$must_have_arg && !$arg && !is_array($arg)) {
            return $this->permissions;
        }

        return $this->permissions->whereIn('id', $arg)->values();
    }

    public function getPermission(null|int|string|array $arg = null, bool $must_have_arg = false): ?Permission
    {
        $permissions = $this->getPermissions();

        if (!$must_have_arg && is_null($arg)) {
            return $permissions->first();
        }

        if (is_int($arg) || (is_string($arg) && ctype_digit($arg))) {
            return $permissions->first(
                fn ($permission) => $permission->id == $arg
            );
        }

        if (is_string($arg) && $attributes = $this->resolvePermissionName($arg)) {
            return $permissions->first(
                fn ($permission) =>
                $permission->model === $attributes['model'] && $permission->action === $attributes['action']
            );
        }

        if (is_array($arg) && keys_exists($arg, 'model', 'action')) {
            return $permissions->first(
                fn ($permission) =>
                $permission->model === $arg['model'] && $permission->action === $arg['action']
            );
        }

        return null;
    }

    public function getRoles(?array $arg = null): Collection
    {
        if (!$this->roles) {
            $this->setPermissions();
        }

        if (!$arg && !is_array($arg)) {
            return $this->roles;
        }

        return $this->roles->whereIn('id', $arg);
    }

    public function getRole(null|int|string $arg = null): ?Role
    {
        $roles = $this->getRoles();

        if (is_null($arg)) {
            return $roles->first();
        }

        if (is_int($arg) || (is_string($arg) && ctype_digit($arg))) {
            return $roles->first(
                fn ($role) => $role->id == $arg
            );
        }

        if (is_string($arg)) {
            return $roles->first(
                fn ($role) => $role->name == $arg,
            );
        }
    }

    public function resolvePermissionName(string $permission): array|false
    {
        $pattern = '/^(?<model>[^\@]+)@(?<action>[^\@]+)$/';

        if (preg_match($pattern, $permission, $matches)) {
            return [
                'model' => $matches['model'],
                'action' => $matches['action'],
            ];
        }
        return false;
    }

    public function isValidPermission(string $permission): bool
    {
        return preg_match('/^[^\@]+@[^\@]+$/', $permission);
    }

    public function isValidArrayPermission(array $permission): bool
    {
        return keys_exists($permission, 'model', 'action');
    }
}
