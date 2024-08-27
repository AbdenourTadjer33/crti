<?php

namespace App\Http\Controllers\Board;

use App\Http\Controllers\Controller;
use App\Http\Resources\Board\BoardResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BoardController extends Controller
{
    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /** @var User */

        // $boardsAsPresident = BoardFeedbackResource::collection(


        return Inertia::render('Board/Index', [
            'boards' => fn() => BoardResource::collection($this->user->onBoards()->with('users:id,uuid,first_name,last_name,email')->get()),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }
}
