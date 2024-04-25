<?php

namespace Modules\Permission;

use Illuminate\Support\Arr;
use Modules\Permission\Models\Role;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;
use Modules\Permission\Models\Permission;
use Illuminate\Database\Eloquent\Collection;
use ReflectionClass;

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
        return Permission::get()->toArray();
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
        $permissionInstance = new Permission;

        return Collection::make(array_map(function ($item) use ($permissionInstance) {
            $permissionAttributes = $item;
            if ($permissionAttributes['type']) {
                $permissionAttributes['contexts'] = json_encode($item['contexts']);
            }
            $permission = $permissionInstance->newInstance([], true)
                ->setRawAttributes($permissionAttributes, true);
            return $permission;
        }, $permissions));
    }

    private function hydrateRoleCollection(array $roles): Collection
    {
        $roleInstance = new Role;

        return Collection::make(array_map(function ($item) use ($roleInstance) {
            $roleAttributes = Arr::except($item, ['permission_ids']);
            return $roleInstance->newInstance([], true)
                ->setRawAttributes($roleAttributes, true)
                ->setRelation('permissions', $this->getPermissions($item['permission_ids']));
        }, $roles));
    }

    public function getPermissions()
    {
        if (!$this->permissions) $this->setPermissions();

        if (count(func_get_args()) === 0) return $this->permissions;

        return $this->permissions->whereIn('id', func_get_args()[0])->values();
    }

    public function getPermission()
    {
        $permissions = $this->getPermissions();

        if (count(func_get_args()) === 0) {
            return $permissions->first();
        }

        $arg = func_get_args()[0];

        if (is_int($arg) || (is_string($arg) && ctype_digit($arg))) {
            return $permissions->first(
                fn ($permission) => $permission->id == $arg,
            );
        }

        if ((is_array($arg) && keys_exists($arg, 'model', 'action')) || (is_string($arg) && $arg = $this->resolvePermission($arg))) {
            return $permissions->first(
                fn (Permission $permission) =>
                $permission->model === $arg['model'] && $permission->action === $arg['action'] && $permission->isGeneric()
            );
        }
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

    public function resolvePermission($permission)
    {
        $pattern = '/^(?<model>[^@]+)@(?<action>[^:]+)(?::(?<context>.*))?$/';

        if (preg_match($pattern, $permission, $matches)) {
            explode(',', "1,2,3,4");
            $matches = collect($matches);
            return collect($matches)->only(['model', 'action', 'context']);
        }
        return false;
    }

    /**
     * 
     * @return array 
     */
    public static function getAllModels(): array
    {
        $models = [];
        // loop on each directory that may have Models inside
        foreach (config('permission.use_permission.models_directories') as $directory) {
            $phpFiles = File::glob($directory['path'] . DIRECTORY_SEPARATOR . '*.php');
            foreach ($phpFiles as $file) {
                // get the namespace of the file
                $className = $directory['namespace'] . '\\' . pathinfo($file, PATHINFO_FILENAME);

                // check if a file is an valid Model
                if (!is_subclass_of($className, 'Illuminate\Database\Eloquent\Model')) {
                    continue;
                }

                // check if this file should be ignored
                if (in_array($className, config('permission.use_permission.except_models', []))) {
                    continue;
                }

                $models[] = $className;
            }
        }
        return $models;
    }

    public static function usePermissionModels()
    {
        return collect(static::getAllModels())->map(function ($model) {
            $reflectionClass = new ReflectionClass($model);

            if ($reflectionClass->hasProperty('usePermission') && !$usePermission = $reflectionClass->getProperty('usePermission')->getValue()) {
                return null;
            }

            return [
                'label' => isset($usePermission) && isset($usePermission['label']) ? $usePermission['label'] : strtolower($reflectionClass->getShortName()),
                'actions' => isset($usePermission) && isset($usePermission['actions']) ? $usePermission['actions'] : collect(config('permission.use_permission.actions'))->except(config('permission.use_permission.except_actions'))->flatten()->toArray(),
                'class' => $reflectionClass->getName()
            ];
        })->whereNotNull()->toArray();
    }

    public static function getUsePermissionModels(): array
    {
        $filename = config('permission.use_permission.file_path') . DIRECTORY_SEPARATOR . config('permission.use_permission.file_name');

        if (file_exists($filename)) {
            return json_decode(file_get_contents($filename), true);
        }

        return static::usePermissionModels();
    }
}
