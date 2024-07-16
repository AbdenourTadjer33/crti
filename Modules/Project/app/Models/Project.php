<?php

namespace Modules\Project\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\Project\Database\Factories\ProjectFactory;
use Modules\Versioning\Traits\Versionable;

class Project extends Model
{
    use HasFactory, SoftDeletes, Versionable;

    protected $guarded = [];

    // protected $dontVersionFields = ['status'];

    // protected $keepOldVersions = 10;

    // protected $versionableRelations = ['tasks', 'users'];

    protected $autoVersioning = false;

    protected static function newFactory(): ProjectFactory
    {
        return ProjectFactory::new();
    }

    protected function casts(): array
    {
        return [
            'domains' => 'array'
        ];
    }

    public function getRouteKeyName()
    {
        return "code";
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
}
