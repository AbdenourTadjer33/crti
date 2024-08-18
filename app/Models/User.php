<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Ramsey\Uuid\Uuid;
use Laravel\Scout\Searchable;
use Laravel\Sanctum\HasApiTokens;
use Modules\Permission\Traits\HasRole;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Builder;
use Modules\Permission\Traits\HasPermission;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Searchable, HasFactory, HasUuids, Notifiable, HasApiTokens, HasPermission, HasRole, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'dob',
        'sex',
        'email',
        'password',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => 'boolean',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Interact with the user's first name.
     */
    protected function firstName(): Attribute
    {
        return Attribute::make(
            get: fn(?string $value) => ucfirst($value),
            set: fn(?string $value) => strtolower($value),
        );
    }

    /**
     * Interact with the user's last name.
     */
    protected function lastName(): Attribute
    {
        return Attribute::make(
            get: fn(?string $value) => ucfirst($value),
            set: fn(?string $value) => strtolower($value)
        );
    }

    /**
     * Generate a new UUID for the model.
     */
    public function newUniqueId(): string
    {
        return (string) Uuid::uuid4();
    }

    /**
     * Get the columns that should receive a unique identifier.
     *
     * @return array<int, string>
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return array_merge($this->toArray(), [
            'id' => (string) $this->id,
            'created_at' => $this->created_at?->timestamp,
        ]);
    }

    public function scopeActive(Builder $query)
    {
        $query->where('status', true);
    }

    public function isActive()
    {
        return (bool) $this->status;
    }

    public function isTrashed()
    {
        return (bool) $this->deleted_at;
    }

    /**
     * Get all divisions associated with the user
     * 
     * This method defines a many to many relationship, indicating 
     * that a user can belongs to many divisions.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function divisions(): BelongsToMany
    {
        return $this->belongsToMany(Division::class, 'division_user', 'user_id', 'division_id')
            ->withTimestamps()
            ->withPivot(['grade']);
    }

    /**
     * Get all projects associated with the user (creator)
     * 
     * This method defines a one-to-many relationship, indicating 
     * that a user can have multiple projects and a project belongs to one user.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'user_id', 'id');
    }

    /**
     * Get all projects associated with the user (member)
     * 
     * This method defines a many-to-many relationship, indicating 
     * that a project can have multiple users (members), and a user 
     * can be associated with multiple projects.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function onProjects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'members', 'user_id', 'project_id');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
}
