<?php

namespace Modules\Authentification\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use Modules\Authentification\Models\User;
use Illuminate\Validation\ValidationException;
use Modules\Authentification\Http\Requests\LoginRequest;

class LoginController extends Controller
{
    public function __invoke(LoginRequest $request)
    {
        dd(Config::get('authentification.name'));
        /**
         * @var User
         */
        $user = User::where('email', $request->input('username'))->first();

        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => trans('auth.failed')
            ]);
        }

        if (Config::get('authentification.staus', true) && !$user->isActive()) {
            return $this->error(null, 402, trans('auth.inactive'));
        }

        return $this->success([
            'token' => $user->createToken($request->input('device_name', $request->ip())),
            'user' => $user,
        ]);
        $user->createToken($request->device_name)->plainTextToken;

    }
}
