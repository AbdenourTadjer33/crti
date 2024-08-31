<?php

namespace App\Http\Controllers\Manage;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Board;
use App\Models\Project;
use Nette\Utils\Random;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\Manage\UserResource;
use App\Http\Resources\Manage\BoardResource;
use App\Http\Requests\Manage\Board\StoreRequest;
use App\Http\Requests\Manage\Board\UpdateRequest;
use App\Http\Resources\Project\ProjectDetailsResource;
use App\Http\Resources\Project\ProjectRessource;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Manage/Board/Index', [
            'boards' => fn () => BoardResource::collection(Board::withCount('users')->with('project:id,code,name')->paginate(15)),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        return Inertia::render('Manage/Board/Create', [
            'projects' => fn () => ProjectRessource::collection(Project::where('status', 'new')->get())
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $board = DB::transaction(function () use ($request) {
            $board = Board::create([
                'code' => Random::generate(),
                'judgment_start_date' => $request->input('judgment_period.from'),
                'judgment_end_date' => $request->input('judgment_period.to'),
                'user_id' => User::query()->where('uuid', $request->input('president'))->value('id'),
                'project_id' => Project::query()->where('code', $request->input('project'))->value('id'),
            ]);

            $members = $request->input('members', []);

            $userIds = User::whereIn('uuid', array_column($members, 'uuid'))->pluck('id')->toArray();

            $board->users()->attach($userIds);

            return $board;
        });

        return redirect()->route('manage.board.show', ['board' => $board->id ])->with('alert', [
            'status' => 'success',
            'message' => 'Board créé avec succès.'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Board $board)
    {
        $project =  Project::query()->where('code', $board->project->code)->first();

        return Inertia::render('Manage/Board/Show', [
            'board' => new BoardResource($board->load('users')),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Board $board)
    {
        return Inertia::render('Manage/Board/Edit', [
            'board' => new BoardResource($board->load('users')),
            'projects' => ProjectRessource::collection(Project::where('status', 'new')->get()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Board $board)
    {
        DB::transaction(function () use ($request, $board) {
            $board->update([
                'judgment_start_date' => $request->input('judgment_period.from'),
                'judgment_end_date' => $request->input('judgment_period.to'),
                'user_id' => User::where('uuid', $request->input('president'))->value('id'),
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) {}
}
