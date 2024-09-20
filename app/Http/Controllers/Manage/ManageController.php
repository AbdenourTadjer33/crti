<?php

namespace App\Http\Controllers\Manage;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;

class ManageController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            'permission:users.manage|permissions&roles.manage|units&divisions.manage|boards.manage|projects.manage|resources.manage'
        ];
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        return Inertia::render('Manage/Index');
    }
}
