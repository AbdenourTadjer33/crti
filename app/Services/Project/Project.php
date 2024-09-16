<?php

namespace App\Services\Project;

use App\Enums\ProjectStatus;
use App\Enums\TaskStatus;
use App\Models\Project as ModelsProject;

class Project implements ProjectInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct() {}

    public function init(array $data): ModelsProject
    {
        return ModelsProject::query()->create([
            'status' => ProjectStatus::creation->name,
            'user_id' => (int) data_get($data, 'user_id'),
            'division_id' => (int) data_get($data, 'division_id'),
        ]);
    }

    public function store(ModelsProject $project, array $data): ModelsProject
    {
        if (data_get($data, 'is_partner', false)) {
            $partner = $project->partner()->create([
                'organisation' => data_get($data, 'partner.organisation'),
                'sector' => data_get($data, 'partner.sector'),
                'contact_name' => data_get($data, 'partner.contact_name'),
                'contact_post' => data_get($data, 'partner.contact_post'),
                'contact_phone' => data_get($data, 'partner.contact_phone'),
                'contact_email' => data_get($data, 'partner.contact_email'),
            ]);
        }

        $project->update([
            'partner_id' => $partner?->id ?? null,
            'nature_id' => data_get($data, 'nature'),
            'status' => data_get($data, 'status', ProjectStatus::new->name),
            'name' => data_get($data, 'name'),
            'date_begin' => data_get($data, 'timeline.from'),
            'date_end' => data_get($data, 'timeline.to'),
            'description' => data_get($data, 'description'),
            'goals' => data_get($data, 'goals'),
            'methodology' => data_get($data, 'methodology'),
            'estimated_amount' => data_get($data, 'estimated_amount'),
            'deliverables' => data_get($data, 'deliverables'),
        ]);

        $project->domains()->attach(data_get($data, 'domains'));

        $members = \App\Models\User::whereIn('uuid', collect(data_get($data, 'members'))->map(fn($m) => $m['uuid']))->get(['id', 'uuid']);

        $project->users()->attach($members->pluck('id'));

        $resources = \App\Models\ExistingResource::query()->whereIn('code', collect(data_get($data, 'resources'))->map(fn($resource) => $resource['code']))->pluck('id');

        $project->existingResources()->attach($resources);

        $project->requestedResources()->createMany([
            ...collect(data_get($data, 'resources_crti', []))->map(fn($r) => array_merge($r, ["by_crti" => true]))->toArray(),
            ...(data_get($data, 'is_partner', false)
                ? collect(data_get($data, 'resources_partner', []))->map(fn($r) => array_merge($r, ["by_crti" => false]))->toArray()
                : [])
        ]);

        for ($i = 0; $i < count(data_get($data, 'tasks', [])); $i++) {
            /** @var Task */
            $task = $project->tasks()->create([
                'name' => data_get($data, "tasks.{$i}.name"),
                'status' => TaskStatus::todo->name,
                'date_begin' => data_get($data, "tasks.{$i}.timeline.from"),
                'date_end' => data_get($data, "tasks.{$i}.timeline.to"),
                'description' => data_get($data, "tasks.{$i}.description"),
                'priority' => data_get($data, "tasks.{$i}.priority"),
            ]);

            $task->users()->attach($members->whereIn('uuid', data_get($data, "tasks.{$i}.users"))->pluck('id'));
        }

        return $project->refresh()->load([
            'partner:id,organisation,sector,contact_name,contact_post,contact_phone,contact_email',
            'division:id,unit_id,name,abbr',
            'division.unit:id,name,abbr',
            'nature:id,name',
            'domains:id,name',
            'user:id,uuid,first_name,last_name,email',
            'users:id,uuid,first_name,last_name,email',
            'tasks:id,project_id,name,status,description,priority,date_begin,date_end,created_at,updated_at',
            'tasks.users:id,uuid,first_name,last_name,email',
            'existingResources:id,code,name,description,state',
            'requestedResources:id,project_id,name,description,price,by_crti',
        ]);
    }

    public function update(ModelsProject $project, array $data): ModelsProject
    {
        $newVersionHasPartner = data_get($data, 'is_partner');
        $currentVersionHasPartner = (bool) $project->partner_id;

        if ($newVersionHasPartner && $currentVersionHasPartner) {
            $project->partner->update(data_get($data, 'partner'));
        } elseif ($newVersionHasPartner && !$currentVersionHasPartner) {
            $partner = $project->partner()->create(data_get($data, 'partner'));
            $project->partner_id = $partner->id;
            $project->save();
        } elseif (!$newVersionHasPartner && $currentVersionHasPartner) {
            $project->partner->delete();
        }

        $project->update([
            'name' => data_get($data, 'name'),
            'nature_id' => data_get($data, 'nature'),
            'date_begin' => data_get($data, 'timeline.from'),
            'date_end' => data_get($data, 'timeline.to'),
            'description' => data_get($data, 'description'),
            'goals' => data_get($data, 'goals'),
            'methodology' => data_get($data, 'methodology'),
            'estimated_amount' => data_get($data, 'estimated_amount'),
            'deliverables' => data_get($data, 'deliverables'),
        ]);

        $project->domains()->sync(data_get($data, 'domains'));

        $members = \App\Models\User::whereIn('uuid', collect(data_get($data, 'members'))->map(fn($m) => $m['uuid']))->get(['id', 'uuid']);

        $project->users()->sync($members->pluck('id'));

        $resources = \App\Models\ExistingResource::query()->whereIn('code', collect(data_get($data, 'resources'))->map(fn($resource) => $resource['code']))->pluck('id');

        $project->existingResources()->sync($resources);

        $project->requestedResources()->getQuery()->delete();

        $project->requestedResources()->createMany([
            ...data_get($data, 'resources_crti'),
            ...($newVersionHasPartner ? data_get($data, 'resources_partner') : [])
        ]);

        $project->tasks()->getQuery()->delete();

        for ($i = 0; $i < count(data_get($data, 'tasks')); $i++) {
            $task = $project->tasks()->create([
                'name' => data_get($data, "tasks.{$i}.name"),
                'status' => 'todo',
                'date_begin' => data_get($data, "tasks.{$i}.timeline.from"),
                'date_end' => data_get($data, "tasks.{$i}.timeline.to"),
                'description' => data_get($data, "tasks.{$i}.description"),
                'priority' => data_get($data, "tasks.{$i}.priority"),
            ]);

            $task->users()->attach(
                $members->whereIn('uuid', data_get($data, "tasks.{$i}.users"))->pluck('id')
            );
        }

        return $project->refresh()->load([
            'partner:id,organisation,sector,contact_name,contact_post,contact_phone,contact_email',
            'division:id,unit_id,name,abbr',
            'division.unit:id,name,abbr',
            'nature:id,name',
            'domains:id,name',
            'user:id,uuid,first_name,last_name,email',
            'users:id,uuid,first_name,last_name,email',
            'tasks:id,project_id,name,status,description,priority,date_begin,date_end,created_at,updated_at',
            'tasks.users:id,uuid,first_name,last_name,email',
            'existingResources:id,code,name,description,state',
            'requestedResources:id,project_id,name,description,price,by_crti',
        ]);
    }
}
