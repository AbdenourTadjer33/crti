<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Board extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected function casts()
    {
        return [
            'judgment_start_date' => 'date',
            'judgment_end_date' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Board $board) {
            $lastBoard = static::query()->whereYear('created_at', now()->year)->latest('id')->first('code');
            $nextSequence = $lastBoard ? (int) substr($lastBoard->code, -4) + 1 : 1;
            $board->code = "CS-" . now()->year . '-' . str_pad($nextSequence, 4, '0', STR_PAD_LEFT);
        });
    }

    protected function name(): Attribute
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
     * Get all boards.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getBoards(): Collection
    {
        return static::all();
    }

    /**
     * Scope a query to only include boards that are currently in the judgment period.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeInJudgmentPeriod($query)
    {
        $currentDate = Carbon::now()->toDateString();

        return $query->where('judgment_start_date', '<=', $currentDate)
            ->where('judgment_end_date', '>=', $currentDate);
    }

    /**
     * Scope a query to only include boards that begin judgment tomorrow.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeBeginsTomorrow($query)
    {
        // Get tomorrow's date
        $tomorrow = Carbon::tomorrow()->toDateString();

        // Return the boards where judgment_start_date is equal to tomorrow
        return $query->where('judgment_start_date', '=', $tomorrow);
    }

    public function scopeStartedOrBeginsTomorrow($query)
    {
        $today = now()->toDateString();
        $tomorrow = now()->addDay()->toDateString();

        return $query->where('judgment_start_date', '<=', $today)
            ->orWhere('judgment_start_date', '=', $tomorrow);
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
            ->using(BoardUser::class)
            ->withTimestamps();
    }

    /**
     * Check if the current date is within the judgment period.
     *
     * @return bool
     */
    public function isOnJudgmentPeriod(): bool
    {
        $currentDate = Carbon::now();

        return $currentDate->between($this->judgment_start_date, $this->judgment_end_date);
    }

    /**
     * Check if the judgment period has passed.
     *
     * @return bool
     */
    public function hasJudgmentPeriodPassed(): bool
    {
        $currentDate = Carbon::now();

        return $currentDate->greaterThan($this->judgment_end_date);
    }
}
