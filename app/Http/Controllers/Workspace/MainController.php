<?php

namespace App\Http\Controllers\Workspace;

use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Project\ProjectRessource;

class MainController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $projectFn = function () {
            /** @var \Illuminate\Database\Eloquent\Builder */
            $baseQuery = Project::with([
                'division:id,unit_id,abbr,name',
                'division.unit:id,abbr,name',
                'nature:id,name',
                'users:id,uuid,first_name,last_name,email',
                'user:id,uuid,first_name,last_name,email',
            ])->whereNotIn('status', ['creation']);

            return ProjectRessource::collection($baseQuery->get());
        };

        return Inertia::render('Workspace/page', [
            'projects' => $projectFn,
        ]);
    }
}
