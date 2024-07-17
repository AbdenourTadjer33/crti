<?php

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Manage\RoleController;
use App\Http\Controllers\Manage\UnitController;
use App\Http\Controllers\Manage\UserController;
use App\Http\Controllers\Manage\ManageController;
use App\Http\Controllers\Manage\PermissionController;
use App\Http\Controllers\Manage\UnitDivisionController;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('auth')->get('/app', function () {
    return Inertia::render('Welcome');
})->name('app');


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

Route::prefix('/app/manage')->as('manage.')->middleware('auth')->group(function () {

    Route::get('/', ManageController::class)->name('index');

    Route::resource('units', UnitController::class)->names('unit');
    Route::resource('units.divisions', UnitDivisionController::class)->names('unit.division');

    Route::resource('permissions', PermissionController::class)->names('permission');
    Route::resource('roles', RoleController::class)->names('role');

    // Route::get('/users/search', [UserController::class, 'search'])->name('user.search');
    Route::resource('users', UserController::class)->names('user');
});