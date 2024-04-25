<?php

namespace Modules\Permission\Traits;

use Illuminate\Support\Collection;
use Modules\Permission\Models\Role;
use Illuminate\Support\Facades\Cache;
use Modules\Permission\Traits\ModelInfo;
use Modules\Permission\Enums\ContextType;
use Modules\Permission\Models\Permission;
use Modules\Permission\PermissionRegistrar;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * Trait HasPermissions
 *
 * This trait provides methods for handling permissions associated with a model.
 */
trait HasPermission
{
    public static function bootHasPermission()
    {
        static::deleting(function ($model) {
            if (method_exists($model, 'isForceDeleting') && !$model->isForceDeleting()) {
                return;
            }

            if (!is_a($model, Permission::class)) {
                $model->permissions()->detach();
            }

            if (is_a($model, Role::class)) {
                $model->users()->detach();
            }
        });
    }

    /**
     * Define a many-to-many relationship for permissions.
     *
     * This method defines a many-to-many relationship between the model and permissions.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphToMany The permissions relationship.
     */
    public function permissions(): MorphToMany
    {
        return $this->morphToMany(
            config('permission.models.permission'),
            'modelable',
            config('permission.table_names.model_has_permissions'),
            null,
            config('permission.columns.fk_permission'),
        );
    }

    /**
     * Load permissions associated with the model.
     *
     * This method loads permissions associated with the model and sets them to the 'permissions' relationship.
     *
     * @return $this The instance of the model.
     */
    public function loadPermissions(): self
    {
        if ($this->relationLoaded('permissions')) {
            return $this;
        }

        if (is_a($this, Role::class)) {
            return Role::getRole($this->id);
        }
        $cachedPermissionIds = Cache::remember(
            $this->getPermissionCacheKey(),
            now()->addMinutes(5),
            fn () => $this->permissions()->pluck('permissions.id')
        );

        $permissions = Permission::getPermissions($cachedPermissionIds->toArray(), true);

        if ($permissions->count() !== $cachedPermissionIds->count()) {
            $this->forgetPermissionIds();
        }

        $this->setRelation('permissions', $permissions);
        return $this;
    }

    /**
     * Get direct permissions of the model.
     *
     * @return Collection The collection of direct permissions.
     */
    public function getDirectPermissions(): Collection
    {
        return $this->loadPermissions()->permissions;
    }

    /**
     * Get all permissions associated with the model.
     *
     * @return Collection The collection of all permissions.
     */
    public function getAllPermissions(): Collection
    {
        $directPermissions = $this->getDirectPermissions();
        if (method_exists($this, 'getPermissionsFromRoles')) {
            return $directPermissions->merge($this->getPermissionsFromRoles())->unique();
        }
        return $directPermissions;
    }

    /**
     * Get the cache key for permission IDs.
     *
     * This method generates the cache key for storing and retrieving permission IDs associated with the model.
     *
     * @return string The cache key.
     */
    private function getPermissionCacheKey(): string
    {
        return static::class . ".{$this->id}.permission_ids";
    }

    /**
     * Forget permission IDs cache.
     *
     * This method removes the cache entry for permission IDs associated with the model.
     *
     * @return bool True if the cache entry was successfully removed, false otherwise.
     */
    private function forgetPermissionIds(): bool
    {
        return Cache::forget($this->getPermissionCacheKey());
    }

    /**
     * Collect permissions from the provided arguments.
     *
     * This method collects permissions from the provided arguments and retrieves their instances from the cache or the database.
     *
     * @param array $args The arguments containing permission names or IDs.
     * @return \Illuminate\Support\Collection A collection of Permission instances.
     */
    public function collectPermissions(array $args): Collection
    {
        return collect($args)->flatten()->map(function ($arg) {
            if ($arg instanceof Permission) {
                return $arg;
            }
            return Permission::getPermission($arg);
        })->whereNotNull()->unique(); // Filter out any null values.
    }

    public function attachAllPermissions(): bool
    {
        $permissions = Permission::getPermissions();
        return $this->attachPermissions($permissions->pluck('id')->toArray());
    }

    /**
     * Attach permissions to the model.
     *
     * This method attaches the specified permissions to the model.
     *
     * @param mixed ...$args The permission names or IDs to attach.
     * @return bool True if permissions were successfully attached, false otherwise.
     */
    public function attachPermissions(...$args): bool
    {
        $permissions = $this->collectPermissions($args);

        if (!$permissions->count()) {
            return false;
        }

        $permissionToAttach = $permissions->pluck('id')->diff($this->getAllPermissions()->pluck('id'))->values();

        if (!$permissionToAttach->count()) {
            return false;
        }

        $this->permissions()->attach($permissionToAttach);

        if (is_a($this, Role::class)) {
            app(PermissionRegistrar::class)
                ->forgetCachedPermissions();
        } else {
            $this->forgetPermissionIds();
        }

        $this->unsetRelation('permissions');
        $this->unsetRelation('roles');

        return true;
    }

    /**
     * Assign a permission to the model.
     *
     * This method assigns the specified permission to the model.
     *
     * @param int $id The ID of the permission to assign.
     * @return bool True if the permission was successfully assigned, false otherwise.
     */
    public function assignPermission($permission): bool
    {
        if (!$permission = $this->collectPermissions($permission)->first()) {
            return false; // Permission does not exist
        }

        if (!$this->hasPermissionTo($permission)) {
            return false; // Permission does not exist model already has the permission.
        }

        $this->permissions()->attach($permission->id);

        if (is_a($this, Role::class)) {
            app(PermissionRegistrar::class)
                ->forgetCachedPermissions();
        } else {
            $this->forgetPermissionIds();
        }
        $this->unsetRelation('permissions');
        $this->unsetRelation('roles');

        return true;
    }

    /**
     * Check if the model has all of the provided permissions.
     *
     * This method checks if the model has all of the provided permissions.
     *
     * @param array $permissions The permissions to check.
     * @return bool True if the model has all of the provided permissions, false otherwise.
     */
    public function hasPermissions(...$args): bool
    {
        $permissions = $this->collectPermissions($args);
        $allPermissions = $this->getAllPermissions();

        // Check if all of the permission IDs are present in the model's permissions.
        foreach ($permissions as $permission) {
            if (!in_array($permission->id, $allPermissions->pluck('id')->toArray())) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if the model has all of the provided direct permissions.
     *
     * @param mixed ...$args The permissions to check.
     * @return bool True if the model has all of the provided direct permissions, false otherwise.
     */
    public function hasDirectPermissions(...$args): bool
    {
        $permissions = $this->collectPermissions($args);
        $directPermissions = $this->getDirectPermissions();

        foreach ($permissions as $permission) {
            if (!in_array($permission->id, $directPermissions->pluck('id')->toArray())) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if the model has any of the provided permissions.
     *
     * This method checks if the model has any of the provided permissions.
     *
     * @param array $permissions The permissions to check.
     * @return bool True if the model has any of the provided permissions, false otherwise.
     */
    public function hasAnyPermission(...$args): bool
    {
        $permissions = $this->collectPermissions($args);
        $allPermissions = $this->getAllPermissions();

        // Check if any of the permission IDs are present in the model's permissions.
        foreach ($permissions as $permission) {
            if (in_array($permission->id, $allPermissions->pluck('id')->toArray())) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if the model has any of the provided direct permissions.
     *
     * @param mixed ...$args The permissions to check.
     * @return bool True if the model has any of the provided direct permissions, false otherwise.
     */
    public function hasAnyDirectPermission(...$args): bool
    {
        $permissions = $this->collectPermissions($args);
        $directPermissions = $this->getAllPermissions();

        foreach ($permissions as $permission) {
            if (in_array($permission->id, $directPermissions->pluck('id')->toArray())) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if the user has permission to a specific permission.
     *
     * @param string $permission The permission pattern to check.
     * @return bool True if the user has the permission, false otherwise.
     */
    public function hasPermissionTo(string $pattern): bool|array
    {
        $resolved = resolvePermission($pattern);
        $context = $resolved['context'] ?? null;

        $permissions = $this->getAllPermissions()->filter(function (Permission $permission) use ($resolved) {
            return $permission->model === $resolved['model'] && $permission->action === $resolved['action'];
        })->sortBy('type')->values();

        if ($permissions->isEmpty()) return false;

        /** @var Permission */
        foreach ($permissions as $permission) {
            if ($permission->isGeneric()) return true; // model has generic permission, allow access to all resources

            if ($context === "*") {
                return $permission->contexts;
            }

            if (in_array((int) $context, $permission->contexts)) {
                return true;
            }
        }

        return false;
    }

    public function hasDirectPermissionTo($id): bool
    {
        return (bool) $this->getDirectPermissions()->first(
            fn ($permission) => $permission->id == $id
        );
    }

    /**
     * Revoke permissions from the model.
     *
     * This method revokes the specified permissions from the model.
     *
     * @param array $permissions The permissions to revoke.
     * @return bool True if permissions were successfully revoked, false otherwise.
     */
    public function revokePermissions(...$args): bool
    {
        if (!$ids = $this->collectPermissions($args)->pluck('id')->toArray()) {
            return false;
        }

        $this->permissions()->detach($ids);

        // Clear the cache for roles or forget cached permissions for other models.
        if (is_a($this, Role::class)) {
            app(PermissionRegistrar::class)->forgetCachedPermissions();
        } else {
            $this->forgetPermissionIds();
        }

        // Unset the permissions relationship to force reloading.
        $this->unsetRelation('permissions');

        return true;
    }

    /**
     * Revoke a permission from the model.
     *
     * @param int $id The ID of the permission to revoke.
     * @return bool True if permission was successfully revoked, false otherwise.
     */
    public function revokePermission($id): bool
    {
        if (!Permission::getPermission($id) && !$this->hasPermissionTo($id)) {
            return false;
        }

        $this->permissions()->detach($id);

        if (is_a($this, Role::class)) {
            app(PermissionRegistrar::class)->forgetCachedPermissions();
        } else {
            $this->forgetPermissionIds();
        }

        $this->unsetRelation('permissions');
        return true;
    }
}
