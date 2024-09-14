<?php

namespace App\Http\Controllers\Board;

use App\Models\User;
use Inertia\Inertia;
use App\Enums\ProjectStatus;
use App\Events\Project\ProjectAccepted;
use App\Events\Project\ProjectRejected;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\Board\BoardResource;
use App\Jobs\Project\UpdateProjectStatusJob;
use App\Http\Resources\Project\ProjectDetailsResource;

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
        /** @var \Illuminate\Database\Eloquent\Collection<int, \App\Models\Board> */
        $boardsFn = function () {
            $boards = $this->user->onBoards()
                ->with(['project:id,code,name,user_id', 'project.user:id,uuid,first_name,last_name,email', 'users:id,uuid,first_name,last_name,email'])
                ->latest('updated_at')
                ->paginate(15);

            return BoardResource::collection($boards);
        };

        return Inertia::render('Board/Index', [
            'boards' => $boardsFn,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $board = $this->user->onBoards()->with('project')->where('code', $request->route('board'))->first();

        if (!$board) return abort(403);

        return Inertia::render('Board/Show', [
            'board' => fn() => new BoardResource($board),
            'project' => fn() => new ProjectDetailsResource($board->project->load(['nature', 'domains', 'partner', 'user', 'users', 'tasks', 'tasks.users', 'existingResources', 'requestedResources', 'division', 'division.unit'])),
        ]);
    }

    public function accept(Request $request)
    {
        $board = $this->user->boards()->where('code', $request->route('board'))->first();

        if (!$board) return abort(403);

        DB::transaction(function () use ($board) {
            $board->decision = true;
            $board->save();

            UpdateProjectStatusJob::dispatchSync($board->project_id, ProjectStatus::pending->name);
            // ProjectAccepted::dispatch($board->project_id);
        });

        return redirect()->back();
    }

    public function reject(Request $request)
    {
        $board = $this->user->boards()->where('code', $request->route('board'))->first();

        if (!$board) return abort(403);

        DB::transaction(function () use ($board) {
            $board->decision = false;
            $board->save();

            UpdateProjectStatusJob::dispatchSync($board->project_id, ProjectStatus::rejected->name);
            // ProjectRejected::dispatch($board->project_id);
        });

        return redirect()->back();
    }
}
