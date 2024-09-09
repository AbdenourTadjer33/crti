<?php

namespace App\Models;

use Illuminate\Support\Arr;
use Modules\Versioning\Models\Version;
use Illuminate\Database\Eloquent\Model;
use Modules\Versioning\Traits\Versionable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Searchable;

class Project extends Model
{
    use Searchable, HasFactory, Versionable;

    protected $guarded = [];

    protected $autoVersioning = false;

    public $versionableRelations = ['division', 'division.unit', 'nature', 'domains', 'partner', 'user', 'users', 'tasks', 'tasks.users', 'existing_resources', 'requested_resources'];

    protected function casts(): array
    {
        return [
            'deliverables' => 'array',
            'estimated_amount' => 'float',
            'version_info' => 'array',
        ];
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'enabled',
        'version_info',
    ];

    protected static function booted(): void
    {
        // init the project code & version_info attribute on evry creation.
        static::creating(function (Project $project) {
            $lastProject = static::query()->whereYear('created_at', now()->year)->latest('id')->first('code');
            $nextSequence = $lastProject ? (int) substr($lastProject->code, -4) + 1 : 1;
            $project->code = 'PRJ-' . now()->year . '-' . str_pad($nextSequence, 4, '0', STR_PAD_LEFT);

            $project->version_info = [
                'main' => null,
                'creation' => [],
                'previous' => [],
                'archived' => [],
                'review' => [],
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

    /**
     * Determine if the model should be searchable.
     *
     * @return bool
     */
    public function shouldBeSearchable(): bool
    {
        return $this->status !== "creation";
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return array_merge($this->only(['code', 'name']), [
            'id' => (string) $this->id,
            'nature' => $this->nature->name,
            'domains' => $this->domains->map(fn($d) => $d->name)->toArray(),
            'status' => __("status.{$this->status}"),
            'created_at' => $this->created_at->timestamp,
        ]);
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
        return $this->status === 'new';
    }

    /**
     * Get all domains associated with the project.
     *
     * This method defines a many-to-many relationship, indicating
     * that a project can have multiple domains, and a domain
     * can be associated with multiple projects.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function domains(): BelongsToMany
    {
        return $this->belongsToMany(Domain::class, 'project_domain', 'project_id', 'domain_id');
    }

    public function nature(): BelongsTo
    {
        return $this->belongsTo(Nature::class, 'nature_id', 'id');
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
     * Get the partner associated with project.
     *
     * This method establishes an inverse one-to-one relationship
     * where a project have one partner
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class, 'partner_id', 'id');
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

    /**
     * Get all existing resource associated with the project.
     *
     * This method defines a many-to-many relationship, indicating
     * that a project can have multiple resources, and a resource
     * can be associated with multiple projects.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function existingResources(): BelongsToMany
    {
        return $this->belongsToMany(ExistingResource::class, 'project_existing_resource', 'project_id', 'resource_id');
    }

    /**
     * Get all requested resources associated with the project.
     *
     * This method defines a one-to-many relationship, indicating
     * that a project can have multiple requested resources, and a requested resource belongs to one project.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function requestedResources(): HasMany
    {
        return $this->hasMany(RequestedResource::class, 'project_id', 'id');
    }

    /**
     * Get the board that owns the project.
     *
     * This method defines a one-to-one relationship, indicating
     * that a project belongs to one board, and board has one project.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function board(): HasOne
    {
        return $this->hasOne(Board::class, 'project_id', 'id');
    }

    public function loadRelationsToVersion(array $relations): self
    {
        $natureInstance = new \App\Models\Nature;
        $nature = $natureInstance->newInstance([], true)
            ->setRawAttributes($relations['nature'], true);

        $domainInstance = new \App\Models\Domain;
        $domains = Collection::make(array_map(
            fn($domain) =>
            $domainInstance->newInstance([], true)
                ->setRawAttributes(Arr::except($domain, 'pivot'), true),
            $relations['domains']
        ));

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

        $partnerInstance = new \App\Models\Partner;
        $partner = $relations['partner'] ? $partnerInstance->newInstance([], true)
            ->setRawAttributes($relations['partner'], true) : null;

        $existingResourceInstance = new \App\Models\ExistingResource;
        $existingResources = Collection::make(array_map(
            fn($resource) =>  $existingResourceInstance->newInstance([], true)->setRawAttributes($resource, true),
            $relations['existing_resources']
        ));

        $requestedResourceInstance = new \App\Models\RequestedResource;
        $requestedResources = Collection::make(array_map(
            fn($resource) => $requestedResourceInstance->newInstance([], true)->setRawAttributes($resource, true),
            $relations['requested_resources']
        ));

        $this->setRelation('nature', $nature);
        $this->setRelation('domains', $domains);
        $this->setRelation('division', $division);
        $this->setRelation('partner', $partner);
        $this->setRelation('user', $user);
        $this->setRelation('users', $usersFn($relations['users']));
        $this->setRelation('tasks', $tasks);
        $this->setRelation('existingResources', $existingResources);
        $this->setRelation('requestedResources', $requestedResources);

        return $this;
    }

    /**
     * Get the main version of a project.
     *
     * @return null|Version
     */
    public function getMainVersion(): ?Version
    {
        if (!$id = (int) $this->version_info['main']) return null;

        return $this->versions()->getQuery()->find($id);
    }

    public function getVersionMarkedAs(string $key)
    {
        return $this->version_info[$key];
    }

    /**
     * Edit version info by key-value pair
     * @var string KEYS ARE: []
     * @var int|array<int>
     *
     * @return void
     */
    public function editVersionInfo(string $key, int|array $value)
    {
        $this->setAttribute("version_info->{$key}", $value);
    }

    /**
     * This will move the current version to previous versions.
     * And ref the provided id as main version.
     */
    public function refVersionAsMain(int $version): bool
    {
        $this->unrefVersion($version);
        $this->editVersionInfo('main', $version);
        return $this->save();
    }

    public function refVersionAsCreation(int $version): bool
    {
        $this->unrefVersion($version);
        $this->editVersionInfo('creation', [
            ...$this->version_info['creation'],
            $version
        ]);
        return $this->save();
    }

    public function refVersionAsReview(int $version): bool
    {
        $this->unrefVersion($version);
        $this->editVersionInfo('review', [
            ...$this->version_info['review'],
            $version,
        ]);
        return $this->save();
    }

    public function refVersionAsPrevious(int $version): bool
    {
        $this->unrefVersion($version);
        $this->editVersionInfo('previous', [
            ...$this->version_info['previous'],
            $version
        ]);
        return $this->save();
    }

    public function refVersionAsArchived(int $version): bool
    {
        $this->unrefVersion($version);
        $this->editVersionInfo('archived', [
            ...$this->version_info['archived'],
            $version,
        ]);
        return $this->save();
    }

    public function unrefVersion(int $version)
    {
        $versionInfo = $this->version_info;

        foreach (['creation', 'review', 'previous', 'archived'] as $key) {
            if (isset($versionInfo[$key]) && in_array($version, $versionInfo[$key])) {
                $versionInfo[$key] = array_values(array_diff($versionInfo[$key], [$version]));
            }
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
