<?php

namespace App\Http\Controllers\Board;

use App\Http\Controllers\Controller;
use App\Http\Resources\Board\BoardResource;
use App\Http\Resources\Project\ProjectDetailsResource;
use App\Models\Board;
use App\Models\Project;
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

        return Inertia::render('Board/Index', [
            'boards' => fn() => BoardResource::collection($this->user->onBoards()->with('users:id,uuid,first_name,last_name,email')->get()),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Board $board)
    {
        $project = Project::query()->where('code', $board->project->code)->first()->getMainVersion()->getModel();


        return Inertia::render('Board/Show', [
            'project' => fn() => new ProjectDetailsResource($project),
            'board' => fn() => new BoardResource($board)
        ]);
    }
}
