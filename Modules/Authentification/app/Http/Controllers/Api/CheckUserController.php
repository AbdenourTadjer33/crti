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

        $user = User::where('email', $request->input('username'))->select('uuid', 'status')->first();

        if (!$user) {
            return $this->error(404);
        }

        if (!$user->status) {
            throw ValidationException::withMessages([
                'username' => trans('auth.inactive')
            ]);
        }
        return $this->success();
    }
}
