<?php

namespace App\Http\Controllers\Workspace;

use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use App\Enums\TaskStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\Project\ProjectTaskResource;

class KanbanController extends Controller
{

    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $projectFn = function () use ($request) {
            $project = Project::with('tasks', 'tasks.users:id,uuid,first_name,last_name,email')
                ->where('code', $request->route('project'))
                ->first(['id', 'code', 'status']);


            return $project;
        };





        return Inertia::render('Workspace/kanban', [
            // 'tasks' => ProjectTaskResource::collection($project->tasks)
        ]);
    }

    public function start(Request $request, Project $project, Task $task)
    {
        DB::transaction(function () use ($task) {
            $task->update([
                'status' => TaskStatus::progress->name,
                'real_start_date' => now()->toDateString(),
            ]);

            DB::table('task_status_histories')->insert([
                'task_id' => $task->id,
                'user_id' => $this->user->id,
                'old_status' => $task->getOriginal('status'),
                'new_status' => $task->status,
            ]);
        });


        return redirect(route('workspace.kanban', $project->code))->with('alert', [
            'status' => 'success',
            'message' => "Tâche {$task->name} est démarrer avec succés",
        ]);
    }

    public function suspend(Request $request, Project $project, Task $task)
    {
        $request->validate([
            'reason' => ['required', 'string', 'min:50', 'max:500'],
        ]);

        DB::transaction(function () use ($request, $task) {
            $task->update([
                'status' => TaskStatus::suspended->name,
                'suspended_at' => now()->toDateString(),
                'suspension_reason' => $request->input('reason'),
            ]);

            DB::table('task_status_histories')->insert([
                'task_id' => $task->id,
                'user_id' => $this->user->id,
                'old_status' => $task->getOriginal('status'),
                'new_status' => $task->status,
                'reason' => $request->input('reason'),
            ]);
        });

        return redirect(route('workspace.kanban', $project->code));
    }

    public function cancel(Request $request, Project $project, Task $task)
    {
        $request->validate([
            'reason' => ['required', 'string', 'min:50', 'max:500'],
        ]);

        DB::transaction(function () use ($request, $task) {
            $task->update([
                'status' => TaskStatus::canceled->name,
                'cancled_at' => now()->toDateString(),
                'cancellation_reason' => $request->input('reason'),
            ]);

            DB::table('task_status_histories')->insert([
                'task_id' => $task->id,
                'user_id' => $this->user->id,
                'old_status' => $task->getOriginal('status'),
                'new_status' => $task->status,
                'reason' => $request->input('reason'),
            ]);
        });

        return redirect(route('workspace.kanban', $project->code))->with('alert', [
            'status' => 'success',
            'message' => "Tâche {$task->name} est annulée avec succés"
        ]);
    }

    public function end(Request $request, Project $project, Task $task)
    {
        DB::transaction(function () use ($task) {
            $task->update([
                'status' => TaskStatus::done->name,
                'real_end_date' => now()->toDateString(),
            ]);

            DB::table('task_status_histories')->insert([
                'task_id' => $task->id,
                'user_id' => $this->user->id,
                'old_status' => $task->getOriginal('status'),
                'new_status' => $task->status,
            ]);
        });

        return redirect(route('workspace.kanban', $project->code))->with('alert', [
            'status' => 'success',
            'message' => "Tâche {$task->name} est marquée comme terminée avec succès"
        ]);
    }
}
