<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Searchable;

class ExistingResource extends Resource
{
    use Searchable; 
    
    protected $defaultSelectColumns = ['id', 'code', 'name', 'description', 'state', 'created_at', 'updated_at'];

    protected function casts(): array
    {
        return [
            ...parent::casts(),
            'state' => 'boolean',
        ];
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
        return $this->state;
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
            'created_at' => $this->created_at->timestamp,
        ]);
    }

    /**
     * Override the newQuery method to include the default select columns.
     *
     * @param  bool  $excludeDeleted
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function newQuery($excludeDeleted = true): Builder
    {
        // Call the parent newQuery method
        $query = parent::newQuery($excludeDeleted);

        // Apply the default select columns
        return $query
            ->where('type', 'existing_resource')
            ->select($this->defaultSelectColumns);
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_existing_resource', 'resource_id', 'project_id');
    }
}
