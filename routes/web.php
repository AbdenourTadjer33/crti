<?php

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('auth')->get('/app', function () {
    return Inertia::render('Welcome');
})->name('app');

Route::get('/app/task', function () {
    return Inertia::render('Task/Index');
});


Route::get('app/search/users', function (Request $request) {
    if (app()->isProduction() && !$request->isXmlHttpRequest()) {
        abort(401);
    }

    if (!$request->input('query')) {
        return abort(404);
    }

    $searchResult = User::search($request->input('query'))->get();

    if (!$searchResult->count()) {
        return [];
    }

    return collect($searchResult)->map(function (User $user) {
        return [
            'name' => $user->first_name . ' ' . $user->last_name,
            ...$user->only('uuid', 'email'),
        ];
    });
})->middleware("auth")->name("search.user");
