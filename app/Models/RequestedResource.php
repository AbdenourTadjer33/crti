<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestedResource extends Resource
{

    protected function casts(): array
    {
        return [
            'price' => 'float',
            'by_crti' => 'boolean'
        ];
    }

    protected $defaultSelectColumns = ['id', 'name', 'description', 'price', 'by_crti', 'project_id', 'created_at', 'updated_at'];

    protected static function booted(): void
    {
        static::creating(function ($resource) {
            $resource->type = "requested_resource";
        });
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
            ->where('type', 'requested_resource')
            ->select($this->defaultSelectColumns);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id', 'id');
    }
}
