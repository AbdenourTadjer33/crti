<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Division extends Model
{
    use HasFactory;

    protected $guarded = [];

    public static function getDivisions()
    {
        return static::get();
    }

    /**
     * Get the unit that own the division
     * 
     * This method establishes an inverse one-to-many relationship 
     * where a division belongs to a single unit.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * Get all users associated with a division
     * 
     * This method defines a many-to-many relationship, indicating 
     * that a division can have multiple users, and a user 
     * can be associated with multiple divisions.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'division_user', 'division_id', 'user_id')
            ->withTimestamps()
            ->withPivot('grade');
    }

    /**
     * Get all projects associated with a division.
     * 
     * This method defines a one-to-many relationship, indicating 
     * that a division can have multiple projects, and a project belongs to one division.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany 
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'division_id', 'id');
    }
}
