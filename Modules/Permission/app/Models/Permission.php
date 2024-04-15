<?php

namespace Modules\Permission\Models;

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

class Permission extends Model
{
    use HasFactory, HasRole, RefreshPermissionCache;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = config('permission.table_names.permissions') ?: parent::getTable();
        $this->fillable([
            'model',
            'action',
        ]);
        $this->casts = [
            'created_at' => 'datetime', 
            'updated_at' => 'datetime'
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

    public function modelHasPermissions(): HasMany
    {
        return $this->hasMany(
            config('permission.models.hasPermission'),
            config('permission.columns.fk_permission'),
        );
    }

    /**
     * @return Permission
     * 
     * @throws PermissionAlreadyExists
     */
    public static function create(array $attributes)
    {
        if (static::getPermission($attributes)) {
            throw new PermissionAlreadyExists();
        }

        return static::query()->create($attributes);
    }

    public static function findById($id)
    {
        $permission = static::getPermission($id);

        if (!$permission) {
            // throw error
        }

        return $permission;
    }

    public static function findByName(string $name)
    {
        $permission = static::getPermission($name);

        if (!$permission) {
            // throw error
        }

        return $permission;
    }

    public static function findOrCreate(string|array $attributes)
    {
        $permission = static::getPermission($attributes);

        if (!$permission) {
            if (
                (is_array($attributes) && keys_exists($attributes, 'action', 'model')) ||
                (is_string($attributes) && $attributes = resolvePermissionName($attributes))
            ) {
                return static::create($attributes);
            }
        }

        return $permission;
    }

    public static function getPermissions(?array $arg = null, $must_have_arg = false): ?Collection
    {
        return app(PermissionRegistrar::class)
            ->getPermissions($arg, $must_have_arg);
    }

    public static function getPermission(null|int|string|array $arg = null, $must_have_arg = false): ?Permission
    {
        return app(PermissionRegistrar::class)
            ->getPermission($arg, $must_have_arg);
    }
}
