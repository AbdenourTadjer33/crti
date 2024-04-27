<?php

namespace Modules\Authentification\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\User;
use Modules\Authentification\Services\Service;
use Modules\Authentification\Http\Requests\RegisterRequest;

class RegisterController extends Controller
{
    public function __invoke(RegisterRequest $request, Service $service)
    {
        /** @var User */
        $user = DB::transaction(
            fn () =>
            User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => bcrypt($request->input('password')),
            ])
        );

        return $this->success([
            'token' => $user->createToken($service->getClientName())->plainTextToken,
            'user' => $user,
        ]);
    }
}
