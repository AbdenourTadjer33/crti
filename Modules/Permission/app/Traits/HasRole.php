<?php

namespace Modules\Permission\Traits;

use App\Traits\HttpResponses;
use Illuminate\Support\Collection;
use Modules\Permission\Models\Role;
use Illuminate\Support\Facades\Cache;
use Modules\Permission\Models\Permission;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

trait HasRole
{

    public static function bootHasRole()
    {
        static::deleting(function ($model) {
            if (method_exists($model, 'isForceDeleting') && !$model->isForceDeleting()) {
                return;
            }

            if (!is_a($model, Role::class)) {
                $model->roles()->detach();
            }

            if (is_a($model, Permission::class)) {
                $model->users()->detach();
            }
        });
    }

    public function roles(): MorphToMany
    {
        return $this->morphToMany(
            Role::class,
            'modelable',
            config('permission.table_names.model_has_roles'),
            null,
            config('permission.columns.fk_role'),
        );
    }

    public function loadRoles(): self
    {
        if ($this->relationLoaded('roles')) {
            return $this;
        }

        $cachedRoleIds = Cache::remember(
            $this->getRoleCacheKey(),
            now()->addMinutes(5),
            fn () => $this->roles()->pluck('roles.id'),
        );

        $roles = Role::getRoles($cachedRoleIds->toArray());

        if ($roles->count() !== $cachedRoleIds->count()) {
            $this->forgetRoleIds();
        }

        $this->setRelation('roles', $roles);
        return $this;
    }

    public function getPermissionsFromRoles(): Collection
    {
        return $this->loadRoles()
            ->roles
            ->pluck('permissions')
            ->flatten()
            ->unique();
    }

    private function getRoleCacheKey(): string
    {
        return static::class . "{$this->id}.role_ids";
    }

    private function forgetRoleIds(): bool
    {
        return Cache::forget($this->getRoleCacheKey());
    }

    private function collectRoles(array $args): Collection
    {
        return collect($args)->flatten()->map(function ($arg) {
            return Role::getRole($arg, true);
        })->whereNotNull();
    }

    public function attachRoles(...$args): bool
    {
        $roles = $this->collectRoles($args);
        return $this->giveRoleTo($roles->pluck('id')->toArray());
    }

    public function giveRoleTo(array $ids): bool
    {
        $this->loadRoles();

        $idsToAttach = array_values(array_diff(
            $ids,
            $this->roles->pluck('id')->toArray()
        ));

        if (!$idsToAttach) {
            return false;
        }

        $this->roles()->attach($idsToAttach);
        $this->forgetRoleIds();
        $this->unsetRelation('roles');

        return true;
    }

    public function assignRole($id): bool
    {
        $this->loadRoles();

        if (!Role::getRole($id, true) || $this->hasRoleTo($id)) {
            return false;
        }

        $this->roles()->attach($id);
        $this->forgetRoleIds();
        $this->unsetRelation('roles');

        return true;
    }

    public function hasRoles(...$args): bool
    {
        $this->loadRoles();

        $roles = $this->collectRoles($args);

        foreach ($roles as $role) {
            if (!in_array($role->id, $this->roles->pluck('id')->toArray())) {
                return false;
            }
        }

        return true;
    }

    public function hasAnyRole(...$args): bool
    {
        $this->loadRoles();

        $roles = $this->collectRoles($args);

        foreach ($roles as $role) {
            if (in_array($role->id, $this->roles->pluck('id')->toArray())) {
                return true;
            }
        }

        return false;
    }

    public function hasRoleTo($id): bool
    {
        $this->loadRoles();

        return (bool) $this->roles->first(
            fn ($role) => $role->id == $id
        );
    }

    public function revokeRoles(...$args): bool
    {
        if (!$ids = $this->collectRoles($args)->pluck('id')->toArray()) {
            return false;
        }

        $this->roles()->detach($ids);
        $this->forgetRoleIds();
        $this->unsetRelation('roles');

        return true;
    }

    public function hasPermissionViaRole()
    {
        $this->loadRoles();
    }
}
