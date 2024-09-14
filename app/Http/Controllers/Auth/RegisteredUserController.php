<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use App\Http\Requests\Auth\RegisterRequest;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(RegisterRequest $request)
    {
        /** @var User */
        $user = DB::transaction(function () use ($request) {
            return User::create([
                'first_name' => $request->input('firstName'),
                'last_name' => $request->input('lastName'),
                'sex' => $request->input('sex', true),
                'dob' => $request->input('dob'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
            ]);
        });

        event(new Registered($user));

        return redirect()->back()->with('alert', [
            'status' => 'success',
            'message' => ''
        ]);
    }

    public function created()
    {
        return Inertia::render('Auth/Created');
    }
}
