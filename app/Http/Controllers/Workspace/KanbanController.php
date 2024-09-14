<?php

namespace App\Http\Controllers\Workspace;

use Closure;
use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use App\Enums\TaskStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Http\Resources\Project\ProjectTaskResource;

class KanbanController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware(function (Request $request, Closure $next) {
                /** @var Project */
                $project = $request->route('project');

                /** @var Task */
                $task = $request->route('task');

                if ($project->user_id === $request->user()->id || $task->users()->wherePivot('user_id', $request->user()->id)->count()) {
                    return $next($request);
                }

                $errorMessages = [
                    "start" => "You are not authorized to start this task. Only assigned members can start the task.",
                    "suspend" => "You are not authorized to suspend this task. Only assigned members can suspend the task.",
                    "cancel" => "You are not authorized to cancel this task. Only assigned members can cancel the task.",
                    "end" => "You are not authorized to end this task. Only assigned members can mark the task as completed.",
                    "resum" => "You are not authorized to resum this task. Only assigned members can resum the task",
                ];

                return abort(403, $errorMessages[$request->route()->getActionMethod()]);
            }, only: ["start", "suspend", "cancel", "end"])
        ];
    }

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

        $project = Project::with([
            'tasks' => fn($query) => $query->latest('updated_at'),
            'tasks.users:id,uuid,first_name,last_name,email',
        ])
            ->where('code', $request->route('project'))
            ->first(['id', 'code', 'status']);

        return Inertia::render('Workspace/kanban', [
            'tasks' => ProjectTaskResource::collection($project->tasks)
        ]);
    }

    public function start(Project $project, Task $task)
    {
        DB::transaction(function () use ($task) {
            $oldStatus = $task->status;

            $task->update([
                'status' => TaskStatus::progress->name,
                'real_start_date' => now()->toDateString(),
            ]);

            DB::table('task_status_histories')->insert([
                'task_id' => $task->id,
                'user_id' => $this->user->id,
                'old_status' => $oldStatus,
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
            $oldStatus = $task->status;

            $task->update([
                'status' => TaskStatus::suspended->name,
                'suspended_at' => now()->toDateString(),
                'suspension_reason' => $request->input('reason'),
            ]);

            DB::table('task_status_histories')->insert([
                'task_id' => $task->id,
                'user_id' => $this->user->id,
                'old_status' => $oldStatus,
                'new_status' => $task->status,
                'reason' => $request->input('reason'),
            ]);
        });

        return redirect(route('workspace.kanban', $project->code))->with('alert', [
            'status' => 'success',
            'message' => "Tâche {$task->name} est suspendue avec succès"
        ]);
    }

    public function cancel(Request $request, Project $project, Task $task)
    {
        $request->validate([
            'reason' => ['required', 'string', 'min:50', 'max:500'],
        ]);

        DB::transaction(function () use ($request, $task) {
            $oldStatus = $task->status;

            $task->update([
                'status' => TaskStatus::canceled->name,
                'cancled_at' => now()->toDateString(),
                'cancellation_reason' => $request->input('reason'),
                'suspended_at' => null,
                'suspension_reason' => null,
            ]);

            DB::table('task_status_histories')->insert([
                'task_id' => $task->id,
                'user_id' => $this->user->id,
                'old_status' => $oldStatus,
                'new_status' => $task->status,
                'reason' => $request->input('reason'),
            ]);
        });

        return redirect(route('workspace.kanban', $project->code))->with('alert', [
            'status' => 'success',
            'message' => "Tâche {$task->name} est annulée avec succés"
        ]);
    }

    public function end(Project $project, Task $task)
    {
        DB::transaction(function () use ($task) {
            $oldStatus = $task->status;

            $task->update([
                'status' => TaskStatus::done->name,
                'real_end_date' => now()->toDateString(),
            ]);

            DB::table('task_status_histories')->insert([
                'task_id' => $task->id,
                'user_id' => $this->user->id,
                'old_status' => $oldStatus,
                'new_status' => $task->status,
            ]);
        });

        return redirect(route('workspace.kanban', $project->code))->with('alert', [
            'status' => 'success',
            'message' => "Tâche {$task->name} est marquée comme terminée avec succès"
        ]);
    }

    public function resum(Project $project, Task $task)
    {
        DB::transaction(function () use ($task) {
            $oldStatus = $task->status;

            $task->update([
                'status' => TaskStatus::progress->name,
                'suspended_at' => null,
                'suspension_reason' => null,
            ]);

            DB::table('task_status_histories')->insert([
                'task_id' => $task->id,
                'user_id' => $this->user->id,
                'old_status' => $oldStatus,
                'new_status' => $task->status,
            ]);
        });

        return redirect(route('workspace.kanban', $project->code))->with('alert', [
            'status' => 'success',
            'message' => "Tâche {$task->name} a repris avec succès"
        ]);
    }
}
