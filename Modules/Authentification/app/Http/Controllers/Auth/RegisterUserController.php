<?php

namespace Modules\Authentification\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Modules\Authentification\Http\Requests\RegisterRequest;

class RegisterUserController extends Controller
{
    public function store(RegisterRequest $request)
    {
        /** @var User */
        $user = DB::transaction(
            fn () =>
            User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password'))
            ])
        );

        event(new Registered($user));

        Auth::login($user);

        return response()->noContent();
    }
}
