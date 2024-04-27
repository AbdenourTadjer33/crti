<?php

namespace Modules\Authentification\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LogoutController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 200, trans('authentification::auth.disconnected'));
    }
}
