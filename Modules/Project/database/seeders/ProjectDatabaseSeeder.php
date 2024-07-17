<?php

namespace Modules\Project\database\seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Modules\Project\Models\Project;
use Modules\Project\Models\Task;
use Modules\Project\Models\Version;

class ProjectDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $creator = User::first();
        $members = User::factory(4)->create()->add($creator);
        $projects = Project::factory(1)->create([
            'user_id' => $creator->id,
        ]);


        foreach ($projects as $project) {
            $project->users()->attach($members);

            $tasks = Task::factory(20)->create([
                'project_id' => $project->id,
            ]);

            foreach ($tasks as $task) {
                $taskMemberIds = $members->slice(0, rand(1, $members->count()))->map(function ($member) {
                    return $member->id;
                });

                $task->users()->attach($taskMemberIds);
            }
        }
    }
}
