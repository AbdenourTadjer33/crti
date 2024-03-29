<?php

namespace Modules\Permission\Models;

use \App\Models\User as UserModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends UserModel
{
   public function permissions(): BelongsToMany
   {
    return $this->belongsToMany(Permission::class)->withPivot(['dead_line', 'created_at', 'updated_at']);
   }
}
