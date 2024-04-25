<?php

namespace Modules\Permission\Models;

use Illuminate\Database\Eloquent\Builder;
use Modules\Permission\Traits\HasRole;
use Illuminate\Database\Eloquent\Model;
use Modules\Permission\PermissionRegistrar;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Permission\Traits\RefreshPermissionCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Modules\Permission\Exceptions\PermissionAlreadyExists;
use Modules\Permission\Database\Factories\PermissionFactory;
use Modules\Permission\Enums\PermissionType;

class Permission extends Model
{
    use HasFactory, HasRole, RefreshPermissionCache;

    protected $guarded = [];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = config('permission.table_names.permissions') ?: parent::getTable();
        $this->casts = [
            'type' => PermissionType::class,
            'contexts' => 'array',
        ];
    }

    protected static function newFactory(): PermissionFactory
    {
        return PermissionFactory::new();
    }

    /**
     * Retrieve the model for a bound value.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function resolveRouteBinding($value, $field = null)
    {
        $permission = static::getPermission($value);
        if (!$permission) {
            abort(404);
        }
        return $permission;
    }

    /**
     * A permission can be assigned to roles.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(
            config('permission.models.role'),
            config('permission.table_names.role_permission'),
            config('permission.columns.fk_role'),
            config('permission.columns.fk_permission'),
        );
    }

    public function users(): MorphToMany
    {
        return $this->morphedByMany(
            \App\Models\User::class,
            'modelable',
            config('permission.table_names.model_has_permissions'),
            config('permission.columns.fk_permission'),
        );
    }

    public function isGeneric()
    {
        return $this->type == PermissionType::Generic;
    }

    public function isContext()
    {
        return $this->type == PermissionType::Context;
    }

    public function scopeGeneric(Builder $query)
    {
        $query->where('type', PermissionType::Generic->value);
    }

    public function scopeContext(Builder $query)
    {
        $query->where('type', PermissionType::Context->value);
    }

    /**
     * @return Permission
     * 
     * @throws PermissionAlreadyExists
     */
    public static function create(array $attributes)
    {
        if (!(isset($attributes['type']) && $attributes['type'] === PermissionType::Context->value) && static::getPermission($attributes)) {
            throw new PermissionAlreadyExists();
        }

        return static::query()->create($attributes);
    }

    public static function findById($id): ?Permission
    {
        return static::getPermission($id);
    }

    public static function findOrCreate(array $attributes): Permission
    {
        $permission = static::getPermission($attributes);

        if ($permission) {
            return $permission;
        }

        return static::query()->create($attributes);
    }

    public static function getPermissions(): ?Collection
    {
        if (count(func_get_args()) === 0) {
            return app(PermissionRegistrar::class)
                ->getPermissions();
        }

        return app(PermissionRegistrar::class)
            ->getPermissions(func_get_args()[0]);
    }

    public static function getPermission(): ?Permission
    {
        if (count(func_get_args()) === 0) {
            return app(PermissionRegistrar::class)
                ->getPermission();
        }

        return app(PermissionRegistrar::class)
            ->getPermission(func_get_args()[0]);
    }
}
