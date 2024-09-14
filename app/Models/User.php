<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Ramsey\Uuid\Uuid;
use Laravel\Scout\Searchable;
use App\Traits\HasPendingActions;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Permission\Traits\HasPermissions;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use Searchable, HasFactory, HasUuids, Notifiable,  HasPermissions, HasRoles, HasPendingActions;

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
            'last_activity' => 'datetime',
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
     * Determine if the model should be searchable.
     *
     * @return bool
     */
    public function shouldBeSearchable(): bool
    {
        return (bool) $this->status;
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return array_merge($this->only(['uuid', 'first_name', 'last_name', 'email']), [
            'id' => (string) $this->id,
            'created_at' => $this->created_at->timestamp,
        ]);
    }

    public function getRouteKeyName()
    {
        return "uuid";
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
            ->withPivot('division_grade_id')
            ->using(DivisionUser::class);
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

    /**
     * Get all boards associated with the user (president)
     *
     * This method defines a one-to-many relationship, indicating
     * that a user (president) is in multiple boards, and a board has one user (president).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function boards(): HasMany
    {
        return $this->hasMany(Board::class, 'user_id', 'id');
    }

    /**
     * Get all boards associated with the user.
     *
     * This method defines a many-to-many relationship, indicating
     * that a user can belong to many boards.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function onBoards(): BelongsToMany
    {
        return $this->belongsToMany(Board::class, 'board_user', 'user_id', 'board_id')
            ->withPivot('comment', 'is_favorable')
            ->using(BoardUser::class)
            ->withTimestamps();
    }
}
