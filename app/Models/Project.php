<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Modules\Versioning\Traits\Versionable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Project extends Model
{
    use HasFactory, SoftDeletes, Versionable;

    protected $guarded = [];

    // protected $dontVersionFields = ['status'];

    // protected $keepOldVersions = 10;

    // protected $versionableRelations = ['tasks', 'users'];

    protected $autoVersioning = false;

    protected function casts(): array
    {
        return [
            'domains' => 'array'
        ];
    }

    /**
     * Interact with the project's name.
     */
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => ucfirst($value),
        );
    }

    protected function nature(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => ucfirst($value),
        );
    }

    public function getRouteKeyName()
    {
        return "code";
    }

    /**
     * Determine if the project is on his first version
     * 
     * @return bool
     */
    public function isFirstVersion(): bool
    {
        return ($this->status === "creation") && ($this->loadCount('versions')->versions_count <= 1);
    }

    /**
     * Determine if the project can have new versions
     * This method is for checking if we can create more version for a project.
     * 
     * @return bool
     */
    public function canHaveNewVersions(): bool
    {
        return in_array($this->status, ['new', 'rejected']);
    }

    /**
     * Get the division that have the project.
     * 
     * This method establishes an inverse one-to-many relationship
     * where a project belongs to a single division
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class, 'division_id', 'id');
    }

    /**
     * Get the user that created the project.
     * 
     * This method establishes an inverse one-to-many relationship 
     * where a project belongs to a single user (the creator).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Get all users associated with the project (members).
     * 
     * This method defines a many-to-many relationship, indicating 
     * that a project can have multiple users (members), and a user 
     * can be associated with multiple projects.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'members', 'project_id', 'user_id');
    }

    /**
     * Get all tasks associated with the project.
     * 
     * This method defines a one-to-many relationship, indicating 
     * that a project can have multiple tasks, and a task belongs to one project.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'project_id', 'id');
    }

    // public function resources(): HasMany
    // {
    // return $this->hasMany(Resource::class);
    // }

    public function loadRelationsToVersion(array $relations): self
    {
        $userInstance = new \App\Models\User;
        $user = $userInstance->newInstance([], true)
            ->setRawAttributes($relations['user'], true);

        $usersFn = function ($param) {
            $userInstance = new \App\Models\User;
            return Collection::make(
                array_map(
                    fn ($user) => $userInstance->newInstance([], true)
                        ->setRawAttributes(
                            Arr::except($user, 'pivot'),
                            true
                        ),
                    $param
                )
            );
        };

        $divisionInstance = new \App\Models\Division;
        $division = $divisionInstance->newInstance([], true)
            ->setRawAttributes($relations['division'], true);

        $taskInstance = new \App\Models\Task;
        $tasks = Collection::make(array_map(
            fn ($task) =>
            $taskInstance->newInstance([], true)
                ->setRawAttributes(Arr::except($task, 'users'), true)
                ->setRelation('users', $usersFn($task['users'])),
            $relations['tasks']
        ));

        $this->setRelation('division', $division);
        $this->setRelation('user', $user);
        $this->setRelation('users', $usersFn($relations['users']));
        $this->setRelation('tasks', $tasks);

        return $this;
    }

    public function lastConfirmedVersion($getRelatedModel = true)
    {
        $model = $this->versions()->getQuery()->where('id', $this->last_confirmed_version_id)->first();
        return $getRelatedModel ? $model?->getModel() : $model;
    }
}
