<?php

namespace Modules\Permission\Models;

use Illuminate\Database\Eloquent\Model;
use Modules\Permission\PermissionRegistrar;
use Illuminate\Database\Eloquent\Collection;
use Modules\Permission\Traits\HasPermission;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Permission\Exceptions\RoleAlreadyExists;
use Modules\Permission\Traits\RefreshPermissionCache;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Permission\Database\Factories\RoleFactory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory, HasPermission, RefreshPermissionCache;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = config('permission.table_names')['roles'] ?? parent::getTable();
        $this->fillable([
            'name',
            'description',
        ]);
        $this->casts = [
            'created_at' => 'datetime',
            'updated_at' => 'datetime'
        ];
    }

    protected static function newFactory(): RoleFactory
    {
        return RoleFactory::new();
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
        $role = static::getRole($value);
        if (!$role) {
            abort(404);
        }
        return $role;
    }

    /**
     * @return Role
     * 
     * @throws RoleAlreadyExists
     */
    public static function create(array $attributes)
    {
        if (static::getRole($attributes['name'])) {
            throw new RoleAlreadyExists();
        }

        return static::query()->create($attributes);
    }

    public function rolePermission(): HasMany
    {
        return $this->hasMany(
            config('permission.models.rolePermission'),
            config('permission.columns.fk_role'),
            'id'
        );
    }

    /**
     * A role may be have various permissions.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            Permission::class,
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
            config('permission.table_names.model_has_roles'),
            config('permission.columns.fk_role')
        );
    }

    public static function findById($id)
    {
        $role = static::getRole($id);

        if (!$role) {
            //  throw
        }

        return $role;
    }

    public static function findByName(string $name)
    {
        $role = static::getRole($name);

        if (!$role) {
            // throw error
        }

        return $role;
    }

    public static function findOrCreate(string|array $attributes)
    {
        $role = static::getRole($attributes);

        if (!$role) {
            if (is_array($attributes) && keys_exists($attributes, 'name')) {
                return static::create($attributes);
            }
        }

        return $role;
    }

    public static function getRoles(?array $arg = null): ?Collection
    {
        return app(PermissionRegistrar::class)
            ->getRoles($arg);
    }

    public static function getRole(null|int|string $arg = null)
    {
        return app(PermissionRegistrar::class)
            ->getRole($arg);
    }
}
