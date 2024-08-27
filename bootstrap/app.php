<?php

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\UpdateUserLastActivity;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();
        $middleware->append(UpdateUserLastActivity::class);
        $middleware->redirectGuestsTo('/');
        $middleware->redirectUsersTo(function () {
            return session('url.intended', '/app');
        });

        $middleware->web([
            HandleInertiaRequests::class
        ]);

        $middleware->convertEmptyStringsToNull([
            fn(Request $request) => $request->is('app/projects/*/versions/*/sync'),
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            if (!app()->environment(['local', 'testing']) && in_array($response->getStatusCode(), [500, 503, 404, 403])) {
                return back()->with('alert', [
                    'status' => $response->getStatusCode(),
                    'message' => $exception->getMessage(),
                ]);
            } elseif ($response->getStatusCode() === 419) {
                return back()->with([
                    'message' => 'The page expired, please try again.',
                ]);
            }

            return $response;
        });
    })->create();
