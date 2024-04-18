<?php

use App\Http\Controllers\TestController;
use App\Models\User;
use Modules\Permission\Models\Role;
use Illuminate\Support\Facades\Route;
use Modules\Permission\Models\Permission;

Route::get('/', function () {
    /** @var User */
    $user = User::first();

    // $user->can();
});


Route::get('/test/create', [TestController::class, 'create']);