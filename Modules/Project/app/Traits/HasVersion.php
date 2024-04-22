<?php

namespace Modules\Project\Traits;

use Modules\Project\Models\Version;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasVersion
{
    public function versions(): HasMany
    {
        return $this->hasMany(Version::class);
    }
}
