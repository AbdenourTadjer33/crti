<?php

namespace App\Http\Controllers\Workspace;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Project\ProjectRessource;

class MainController extends Controller
{

    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $projectFn = function () use ($request) {
            /** @var \Illuminate\Database\Eloquent\Builder */
            $baseQuery = Project::with([
                'division:id,unit_id,abbr,name',
                'division.unit:id,abbr,name',
                'nature:id,name',
                'users:id,uuid,first_name,last_name,email',
                'user:id,uuid,first_name,last_name,email',
            ])->whereNotIn('status', ['creation']);

            if ($request->input('status')) {
                $baseQuery->whereIn('status', $request->input('status'));
            }

            $baseQuery->where(function ($query) {
                $query->orWhere('user_id', $this->user->id);
                
                $query->orWhereHas('users', function ($userQuery) {
                    $userQuery->where('user_id', $this->user->id);
                });

                $query->orwhereIn('division_id', $this->user->divisions()->pluck('id'));
            });

            return ProjectRessource::collection($baseQuery->get());
        };

        return Inertia::render('Workspace/page', [
            'projects' => $projectFn,
        ]);
    }
}
