<?php

namespace Modules\Project\Traits;

use Modules\Project\Models\Project;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait HasProject
{

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    // status => [nouveau project, en examen, rejeté, en instance, accepter ]

    /**
     *
     */


}
