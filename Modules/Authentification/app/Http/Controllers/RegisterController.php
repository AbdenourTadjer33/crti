<?php

namespace Modules\Authentification\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Modules\Authentification\Models\User;
use Modules\Authentification\Http\Requests\RegisterRequest;

class RegisterController extends Controller
{
    public function __invoke(RegisterRequest $request)
    {
        $user = DB::transaction(
            fn () =>
            User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => bcrypt($request->input('password')),
            ])
        );

        return response()->json([
            'user' => $user, 
        ]);
    }
}
