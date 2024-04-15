<?php

namespace Modules\Authentification\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use Illuminate\Database\Eloquent\Builder;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
}
