<?php

namespace Modules\Authentification\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Laravel\Sanctum\PersonalAccessToken;

class TokenController extends Controller
{
    private $user;

    public function __construct(Request $request)
    {
        /**
         * @var \Modules\Authentification\Models\User
         */
        $this->user = $request->user();
    }

    public function index()
    {
        $tokens = $this->user->tokens()->get(['id', 'name', 'last_used_at']);

        $tokens->map(function (PersonalAccessToken $token) {
            if ($token->id === $this->user->currentAccessToken()->id) {
                $token->current = true;
            }
        });

        return $this->success([
            'tokens' => $tokens
        ]);
    }

    public function destroy($id)
    {
        if (!$this->user->tokens()->where('id', $id)->delete()) {
            return $this->error(null, 404, trans('something went wrong'));
        }

        return $this->success(null, 200, trans('authentification::auth.token.deleted'));
    }

    public function destroyAll()
    {
        if (!$this->user->tokens()->whereNot('id', $this->user->currentAccessToken()->id)->delete()) {
            return $this->error(null, 404, trans('something went wrong'));
        }

        return $this->success(null, 200, trans('authentification::auth.tokens.deleted'));
    }
}
