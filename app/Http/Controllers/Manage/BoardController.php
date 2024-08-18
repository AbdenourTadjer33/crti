<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use App\Http\Requests\Manage\Board\StoreRequest;
use App\Http\Requests\Manage\Board\UpdateRequest;
use App\Http\Resources\Manage\BoardResource;
use App\Models\Board;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Manage/Board/Index', [
            'boards' => fn () => BoardResource::collection(Board::withCount('users')->paginate(15)),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Board $board)
    {
        return Inertia::render('Manage/Board/Create', [
            'board' => $board,
            // 'project' => Project::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $board = DB::transaction(function () use ($request) {
            $board = Board::create([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'judgment_start_date' => Carbon::parse($request->input('judgment_start_date'))->format('Y-m-d'),
                'judgment_end_date' => Carbon::parse($request->input('judgment_end_date'))->format('Y-m-d'),
            ]);

            $members = $request->input('members', []);
            $userIds = User::whereIn('uuid', array_column($members, 'uuid'))->pluck('id')->toArray();
            $board->users()->attach($userIds);

            $projectIds = $request->input('projects', []);
            if (!empty($projectIds)) {
            Project::whereIn('id', $projectIds)->update(['board_id' => $board->id]);
        }
            return $board;
        });

        return redirect()->route('manage.board.index')->with('alert', [
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
        return Inertia::render('Manage/Board/Edit', [
            'board' => $board->load('users'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Board $board)
    {
        DB::transaction(function () use ($request, $board) {
            $board->update([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
            ]);

            $members = $request->input('members', []);
            $userIds = User::whereIn('uuid', array_column($members, 'uuid'))->pluck('id')->toArray();

            $board->users()->sync($userIds);
        });

        return redirect()->route('manage.board.show',[
            'board' => $board
        ])->with('alert', [
            'status' => 'success',
            'message' => 'Board mis à jour avec succès.'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
