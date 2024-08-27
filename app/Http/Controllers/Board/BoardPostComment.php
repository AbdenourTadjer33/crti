<?php

namespace App\Http\Controllers\Board;

use App\Models\User;
use App\Models\Board;
use App\Http\Controllers\Controller;
use App\Http\Requests\Board\StoreRequest;

class BoardPostComment extends Controller
{
    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(StoreRequest $request, Board $board)
    {
        if (!$board->users()->where('id', $this->user->id)->count()) {
            return abort(403);
        }

        $board->users()->sync([$this->user->id => [
            'comment' => $request->input('comment'),
            'is_favorable' => $request->input('isFavorable')
        ]], false);

        return redirect()->back();
    }
}
