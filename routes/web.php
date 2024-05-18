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

Route::get('/user-search', function (Request $request) {
    dump(
        User::search($request->input('user'))->paginate()->items()
    );
});
