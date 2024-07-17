<?php

namespace Modules\Project\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Modules\Project\Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Task extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected static function newFactory(): TaskFactory
    {
        return TaskFactory::new();
    }

    /**
     * Get the project that own this task.
     * 
     * this method establishes an invert one-to-many relationship
     * where a task belongs to a single project.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id', 'id');
    }

    /**
     * Get all users associated with the task (the assigned members).
     * 
     * This method defines a many-to-many relationship, indicating 
     * that a task can be assigned to multiple users, and a user 
     * can have multiple tasks assigned to them.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_user', 'task_id', 'user_id');
    }
}
