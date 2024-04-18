<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class TestController extends Controller
{
    public function index()
    {
    }

    public function create()
    {
        /** @var User */
        $user = User::first();
        Auth::login($user);

        $user->can(['create', 'update']);        
        // Gate::authorize('create');
        dump();
    }

    public function store()
    {
    }

    public function edit()
    {
    }

    public function update()
    {
    }

    public function destroy()
    {
    }
}
