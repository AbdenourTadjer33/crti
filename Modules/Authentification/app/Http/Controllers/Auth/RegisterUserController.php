<?php

namespace Modules\Authentification\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Modules\Authentification\Http\Requests\RegisterRequest;

class RegisterUserController extends Controller
{
    public function store(RegisterRequest $request)
    {
        /** @var User */
        $user = DB::transaction(function () use ($request) {
            return User::create([
                'first_name' => $request->input('fname'),
                'last_name' => $request->input('lname'),
                'sex' => $request->input('sex', true),
                'dob' => $request->input('dob'),
                'email' => $request->input('username'),
                'password' => Hash::make($request->input('password')),
            ]);
        });

        event(new Registered($user));

        return redirect(URL::signedRoute('auth.created'));
    }
}
