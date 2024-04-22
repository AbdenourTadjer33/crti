<?php

namespace Modules\Project\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\Project\Database\Factories\ProjectFactory;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    protected static function newFactory(): ProjectFactory
    {
        return ProjectFactory::new();
    }

    public function versions(): HasMany
    {
        return $this->hasMany(Version::class);
    }

    public function updateStatus($status): bool
    {
        return $this->update([
            'status' => $status
        ]);
    }
}
