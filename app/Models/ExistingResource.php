<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ExistingResource extends Resource
{
    protected $defaultSelectColumns = ['id', 'code', 'name', 'description', 'state', 'created_at', 'updated_at'];

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
