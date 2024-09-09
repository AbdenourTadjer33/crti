<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class CheckUserController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'username' => ['required', 'email'],
        ]);

        /** @var User */
        $user = User::where('email', $request->input('username'))->select('status')->first();

        if (!$user) {
            return $this->error(404);
        }

        return $this->success(code: 204);
    }
}
