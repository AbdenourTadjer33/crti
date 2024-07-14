<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->redirectGuestsTo('/');

        $middleware->redirectUsersTo(function () {
            return session('url.intended', '/app');
        });

        $middleware->web([
            HandleInertiaRequests::class
        ]);

        $middleware->statefulApi();

        $middleware->convertEmptyStringsToNull([
            fn (Request $request) => $request->is('app/projects/*/versions/sync'),
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
