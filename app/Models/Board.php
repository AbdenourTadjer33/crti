<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Board extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn(?string $value) => ucfirst($value),
        );
    }

    /**
     * Get all boards.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getBoards(): Collection
    {
        return static::all();
    }

    /**
     * Get the project that belongs to the board
     *
     * This method defines a one-to-one relationship, indicating
     * that a board can have one project and a project belongs to one board.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id', 'id');
    }

    /**
     * Get the user (president) of the board
     *
     * This method establishes an inverse one-to-many relationship
     * where a board belongs to a single user (the president).
     */
    public function user(): BelongsTo|null
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Get all users (board members) associated with the board.
     *
     * This method defines a many-to-many relationship, indicating
     * that a board can have many users.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'board_user', 'board_id', 'user_id')
            ->withPivot('comment', 'is_favorable')
            ->withTimestamps();
    }
}
