<?php

namespace Modules\Permission\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Modules\Permission\Database\Factories\ContextFactory;
use Modules\Permission\Enums\ContextType;

class Context extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $guarded = [];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = config('permission.table_names.contexts');
        $this->casts = [
            'type' => ContextType::class
        ];

    }

    protected static function newFactory(): ContextFactory
    {
        return ContextFactory::new();
    }

    public function permission(): BelongsTo
    {
        return $this->belongsTo(
            Permission::class,
            config('permission.columns.fk_permission')
        );
    }

    public function context(): MorphTo
    {
        return $this->morphTo('context');
    }
}
