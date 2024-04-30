<?php

namespace Modules\Authentification\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AuthUserController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Create');
    }

    public function created()
    {
        return Inertia::render('Auth/Created');
    }
}
