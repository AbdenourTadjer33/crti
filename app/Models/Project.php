<?php

namespace App\Models;

use Illuminate\Support\Arr;
use Illuminate\Database\Eloquent\Model;
use Modules\Versioning\Traits\Versionable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Modules\Versioning\Models\Version;
use phpDocumentor\Reflection\Types\Null_;

class Project extends Model
{
    use HasFactory, SoftDeletes, Versionable;

    protected $guarded = [];

    protected $autoVersioning = false;

    public $versionableRelations = ['division', 'user', 'users', 'tasks', 'tasks.users'];

    protected function casts(): array
    {
        return [
            'domains' => 'array',
            'version_info' => 'array',
        ];
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'version_info',
    ];

    protected static function booted(): void
    {
        // init the project version_info attribute on creation.
        static::creating(function (Project $project) {
            $project->version_info = [
                'main' => null,
                'creation' => [],
                'created' => [],
            ];
        });
    }

    /**
     * Interact with the project's name.
     */
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn(?string $value) => ucfirst($value),
        );
    }

    protected function nature(): Attribute
    {
        return Attribute::make(
            get: fn(?string $value) => ucfirst($value),
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
    public function isFirstVersion(int $versionCount): bool
    {
        return ($this->status === "creation") && ($versionCount <= 1);
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
                    fn($user) => $userInstance->newInstance([], true)
                        ->setRawAttributes(
                            Arr::except($user, 'pivot'),
                            true
                        ),
                    $param
                )
            );
        };

        $unitInstance = new \App\Models\Unit;
        $unit = $unitInstance->newInstance([], true)
            ->setRawAttributes($relations['division']['unit'], true);

        $divisionInstance = new \App\Models\Division;
        unset($relations['division']['unit']);
        $division = $divisionInstance->newInstance([], true)
            ->setRawAttributes($relations['division'], true)
            ->setRelation('unit', $unit);

        $taskInstance = new \App\Models\Task;
        $tasks = Collection::make(array_map(
            fn($task) =>
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

    public function getMainVersion($getRelatedModel = true)
    {
        $mainVersionId = (int) $this->version_info['main'];

        if (!$mainVersionId) return;

        $version = $this->versions()->getQuery()->where('id', $mainVersionId)->first();

        return $getRelatedModel ? $version?->getModel() : $version;
    }

    /**
     * This method return an array of version ids that are on creation
     * @return array
     */
    public function getCreationVersions()
    {
        return $this->version_info['creation'];
    }

    /**
     * This method return all versions that are under creation.
     * 
     * @param int $userId
     */
    // public function getCreationVersions(int $userId)
    // {
    // return $this->versions()->whereIn('id', $this->version_info['creation'])->where('user_id', $userId)->get();
    // }

    public function getCreatedVersions() {}

    public function refVersionAsMain(int $version): bool
    {
        $this->unrefVersion($version);
        $this->setAttribute('version_info->main', $version);
        return $this->save();
    }

    public function refVersionAsCreation(int $version): bool
    {
        $this->unrefVersion($version);
        $creation = $this->version_info['creation'] ?? [];
        $creation[] = $version;
        $this->setAttribute('version_info->creation', $creation);
        return $this->save();
    }

    public function refVersionAsCreated(int $version): bool
    {
        $this->unrefVersion($version);
        $created = $this->version_info['created'] ?? [];
        $created[] = $version;
        $this->setAttribute('version_info->created', $created);
        return $this->save();
    }

    public function unrefVersion(int $version)
    {
        $versionInfo = $this->version_info;

        if (isset($versionInfo['created']) && in_array($version, $versionInfo['created'])) {
            $versionInfo['created'] = array_values(array_diff($versionInfo['created'], [$version]));
        }

        if (isset($versionInfo['creation']) && in_array($version, $versionInfo['creation'])) {
            $versionInfo['creation'] = array_values(array_diff($versionInfo['creation'], [$version]));
        }

        $this->version_info = $versionInfo;
    }

    public function unrefVersionWithSaving(int $version): bool
    {
        $this->unrefVersion($version);
        return $this->save();
    }

    /**
     * WITHOUT SAVING
     */
    public function syncVersion(?int $main = null, ?array $onCreation = null, ?array $onCreated = null)
    {
        if ($main !== null) {
            $this->setAttribute('version_info->main', $main);
        }

        if ($onCreation !== null) {
            $this->setAttribute('version_info->creation', $onCreation);
        }

        if ($onCreated !== null) {
            $this->setAttribute('version_info->created', $onCreated);
        }
    }

    public function clearMainVersion()
    {
        $this->setAttribute('version_info->main', null);
    }

    /**
     * WITHOUT SAVING
     */
    public function clearCreatedVersion()
    {
        $this->syncVersion(onCreated: []);
    }

    /**
     * WITHOUT SAVING
     */
    public function clearCreationVersion()
    {
        $this->syncVersion(onCreation: []);
    }
}
