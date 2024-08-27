<?php

namespace App\Http\Controllers\Manage;

use App\Http\Controllers\Controller;
use App\Http\Requests\Manage\Board\StoreRequest;
use App\Http\Requests\Manage\Board\UpdateRequest;
use App\Http\Resources\Manage\BoardResource;
use App\Http\Resources\Manage\UserResource;
use App\Http\Resources\Project\ProjectDetailsResource;
use App\Models\Board;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;
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
            'boards' => fn() => BoardResource::collection(Board::withCount('users')->with('project:id,code,name')->paginate(15)),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Manage/Board/Create', [
            'projects' => ProjectDetailsResource::collection(Project::where('status', 'new')->get()),
            // 'users' => User::all()->map(fn(User $user) => [
            //     'uuid' => $user->uuid,
            //     'name' => $user->first_name . " " . $user->last_name,
            //     'email' => $user->email,
            // ])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        DB::transaction(function () use ($request) {
            $board = Board::create([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'judgment_start_date' => Carbon::parse($request->input('judgment_period.from'))->format('Y-m-d'),
                'judgment_end_date' => Carbon::parse($request->input('judgment_period.to'))->format('Y-m-d'),
                'user_id' => User::query()->where('uuid', $request->input('president'))->value('id'),
                'project_id' => Project::where('code', $request->input('project'))->value('id'),
            ]);
            $members = $request->input('members', []);
            $userIds = User::whereIn('uuid', array_column($members, 'uuid'))->pluck('id')->toArray();
            $board->users()->attach($userIds);

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
            'board' => new BoardResource($board->load('users')),
            'projects' => ProjectDetailsResource::collection(Project::where('status', 'new')->get()),
            'users' => UserResource::collection(User::all())
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Board $board)
    {

        // dd($request->all());

        DB::transaction(function () use ($request, $board) {
            $board->update([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'judgment_start_date' => Carbon::parse($request->input('judgment_period.from'))->format('Y-m-d'),
                'judgment_end_date' => Carbon::parse($request->input('judgment_period.to'))->format('Y-m-d'),
                'user_id' => User::where('uuid', $request->input('president'))->value('id'),
                'project_id' => Project::where('code', $request->input('project'))->value('id'),
            ]);

            $members = $request->input('members', []);
            $userIds = User::whereIn('uuid', array_column($members, 'uuid'))->pluck('id')->toArray();

            $board->users()->sync($userIds);
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
