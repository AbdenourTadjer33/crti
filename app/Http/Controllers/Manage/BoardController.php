<?php

namespace App\Http\Controllers\Manage;

use App\Enums\ProjectStatus;
use App\Events\BoardComming;
use App\Events\ProjectPassToReview;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Board;
use App\Models\Project;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\Manage\BoardResource;
use App\Http\Requests\Manage\Board\StoreRequest;
use App\Http\Requests\Manage\Board\UpdateRequest;
use App\Http\Resources\Manage\Board\BoardOnEditResource;
use App\Jobs\Project\UpdateProjectStatusJob;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $boardsFn = function () {
            $boards = Board::with([
                'project:id,code,name',
                'users:id,uuid,first_name,last_name,email',
            ])->latest()->paginate(15);

            return BoardResource::collection($boards);
        };

        return Inertia::render('Manage/Board/Index', [
            'boards' => $boardsFn,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Manage/Board/Create', []);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $board = DB::transaction(function () use ($request) {
            $board = Board::create([
                'judgment_start_date' => $request->input('judgment_period.from'),
                'judgment_end_date' => $request->input('judgment_period.to'),
                'user_id' => User::query()->where('uuid', $request->input('president'))->value('id'),
                'project_id' => Project::query()->where('code', $request->input('project'))->value('id'),
            ]);

            $members = $request->input('members', []);

            $userIds = User::whereIn('uuid', array_column($members, 'uuid'))->pluck('id')->toArray();

            $board->users()->attach($userIds);

            UpdateProjectStatusJob::dispatch($board->project_id, ProjectStatus::review->name)
                ->delay(now()->diffInSeconds($board->judgment_start_date))
                ->afterCommit();

            ProjectPassToReview::dispatch($board->project_id, now()->diffInSeconds($board->judgment_start_date));
            BoardComming::dispatch($board->id, now()->diffInSeconds($board->judgment_start_date->subDay()));

            return $board;
        });

        return redirect()->route('manage.board.show', ['board' => $board->code])->with('alert', [
            'status' => 'success',
            'message' => 'Board créé avec succès.'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Board $board)
    {
        return Inertia::render('Manage/Board/Show', [
            'board' => new BoardResource($board->load('users')),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Board $board)
    {
        if ($board->hasJudgmentPeriodPassed() || $board->isOnJudgmentPeriod()) {
            return abort(403);
        }

        return Inertia::render('Manage/Board/Edit', [
            'board' => new BoardOnEditResource($board->load(['users:id,uuid,first_name,last_name,email', 'project:id,nature_id,user_id,division_id,code,name,created_at'])),
        ]);
    }

    // NOT FINISHED
    public function update(UpdateRequest $request, Board $board)
    {
        if ($board->hasJudgmentPeriodPassed() || $board->isOnJudgmentPeriod()) {
            return redirect()->back()->with('alert', [
                'status' => 'error',
                'message' => 'Vous pouvez pas effectuer cette action'
            ]);
        }

        DB::transaction(function () use ($request, $board) {
            $board->update([
                'judgment_start_date' => $request->input('judgment_period.from'),
                'judgment_end_date' => $request->input('judgment_period.to'),
                'user_id' => User::query()->where('uuid', $request->input('president'))->value('id'),
                'project_id' => Project::query()->where('code', $request->input('project'))->value('id'),
            ]);

            $members = $request->input('members', []);
            $userIds = User::whereIn('uuid', array_column($members, 'uuid'))->pluck('id')->toArray();

            $board->users()->sync($userIds);


            return $board;
        });

        return redirect()->route('manage.board.show', [
            'board' => $board
        ])->with('alert', [
            'status' => 'success',
            'message' => 'Board mis à jour avec succès.'
        ]);
    }

    // NOT FINISHED
    public function destroy(Board $board)
    {
        if ($board->hasJudgmentPeriodPassed() || $board->isOnJudgmentPeriod()) {
            return redirect()->back()->with('alert', [
                'status' => 'error',
                'message' => 'Vous ne pouvez pas supprimer ce conseil. Si vous le souhaitez, vous pouvez l\'archiver.'
            ]);
        }

        $board->delete();

        return redirect(route('manage.board.index'))->with('alert', [
            'status' => 'success',
            'message' => 'Le conseil est supprimé avec succès.'
        ]);
    }

    public function archive() {}
}
