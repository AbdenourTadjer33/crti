<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AccountValidationController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        if ($request->user()->isActive()) {
            return redirect(route('app'));
        }

        return Inertia::render('Auth/PendingValidation');
    }
}
