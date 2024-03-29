<?php

namespace Modules\Authentification\Models;

use App\Models\User as UserModel;

class User extends UserModel
{
    public function scopeActive()
    {

    }

    public function isActive()
    {
        return $this->status;
    }
}
