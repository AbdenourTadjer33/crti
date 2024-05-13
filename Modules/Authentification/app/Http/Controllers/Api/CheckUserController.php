<?php

namespace Modules\Authentification\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class CheckUserController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'username' => ['required', 'email'],
        ]);

        /** @var User */
        $user = User::withTrashed()->where('email', $request->input('username'))->select('status')->first();

        if (!$user) {
            return $this->error(404);
        }

        return $this->success(code: 204);
    }
}
