<?php

namespace Modules\Permission\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Modules\Permission\Database\factories\PermissionFactory;

class Permission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'description',
        'model',
        'action'
    ];

    protected static function newFactory(): PermissionFactory
    {
        return PermissionFactory::new();
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withPivot(['dead_line', 'created_at', 'updated_at']);
    }

}
