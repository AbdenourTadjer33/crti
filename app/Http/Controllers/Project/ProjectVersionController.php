<?php

namespace App\Http\Controllers\Project;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Domain;
use App\Models\Nature;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\ExistingResource;
use App\Services\AuxDataService;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Modules\Versioning\Models\Version;
use App\Events\Project\NewVersionSuggested;
use App\Http\Requests\Version\StoreRequest;
use App\Http\Requests\Version\CreateRequest;
use App\Http\Requests\Version\UpdateRequest;
use Illuminate\Routing\Controllers\Middleware;
use App\Http\Requests\Version\DuplicateRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Http\Resources\Project\ProjectVersionResource;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;

class ProjectVersionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission',  only: []),
            new Middleware(HandlePrecognitiveRequests::class, only: ['store', 'update'])
        ];
    }

    private User $user;

    public function __construct()
    {
        $this->user = request()->user();
    }

    public function create(CreateRequest $request)
    {
        /** @var Project */
        $project = $this->user->projects()->getQuery()
            ->withCount('versions')
            ->where('code', $request->route('project'))
            ->first();

        if (!$project || !$project->isFirstVersion($project->versions_count)) return abort(404);

        $versionFn = function () use ($project) {
            $version = $project->currentVersion();

            if (!$version) {
                $version = $project->versions()->create([
                    'model_data' => serialize([]),
                    'reason' => 'creating the project first version',
                    'user_id' => $this->user->id,
                ]);

                $project->refVersionAsCreation($version->id);
            }

            return [
                'id' => $version->id,
                ...unserialize($version->model_data),
            ];
        };

        return Inertia::render('Project/Create', [
            'version' => $versionFn,
            'domains' => fn() => Domain::getDomains()->map(fn(Domain $domain) => $domain->only(['id', 'name', 'suggested'])),
            'natures' => fn() => Nature::getNatures()->map(fn(Nature $nature) => $nature->only(['id', 'name', 'suggested']))
        ]);
    }

    /**
     * Update all the project state by the coming data.
     * Update the project current version by the project & project relations data.
     * Finnaly reference this current version as the main project version.
     * Send success response to the user
     */
    public function store(StoreRequest $request, Project $project)
    {
        if (!$project->isFirstVersion($project->loadCount('versions')->versions_count)) {
            return abort(403);
        };

        DB::transaction(function () use ($request, $project) {
            if ($request->input('is_partner')) {
                $partner = $project->partner()->create([
                    'organisation' => $request->input('partner.organisation'),
                    'sector' => $request->input('partner.sector'),
                    'contact_name' => $request->input('partner.contact_name'),
                    'contact_post' => $request->input('partner.contact_post'),
                    'contact_phone' => $request->input('partner.contact_phone'),
                    'contact_email' => $request->input('partner.contact_email'),
                ]);
            }

            $project->update([
                'partner_id' => $partner?->id ?? null,
                'nature_id' => $request->input('nature'),
                'status' => 'new',
                'name' => $request->input('name'),
                'date_begin' => $request->input('timeline.from'),
                'date_end' => $request->input('timeline.to'),
                'description' => $request->input('description'),
                'goals' => $request->input('goals'),
                'methodology' => $request->input('methodology'),
                'estimated_amount' => $request->input('estimated_amount'),
                'deliverables' => $request->input('deliverables'),
            ]);

            $project->domains()->attach($request->input('domains'));

            $members = User::withoutTrashed()->whereIn('uuid', collect($request->members)->map(fn($m) => $m['uuid']))->get(['id', 'uuid']);

            $project->users()->attach($members->pluck('id'));

            $resources = ExistingResource::query()->whereIn('code', collect($request->resources)->map(fn($resource) => $resource['code']))->pluck('id');

            $project->existingResources()->attach($resources);

            $project->requestedResources()->createMany([
                ...$request->input('resources_crti'),
                ...($request->input('is_partner') ? $request->input('resources_partner') : [])
            ]);

            for ($i = 0; $i < count($request->tasks); $i++) {
                /** @var Task */
                $task = $project->tasks()->create([
                    'name' => $request->input("tasks.{$i}.name"),
                    'status' => 'to_do',
                    'date_begin' => $request->input("tasks.{$i}.timeline.from"),
                    'date_end' => $request->input("tasks.{$i}.timeline.to"),
                    'description' => $request->input("tasks.{$i}.description"),
                    'priority' => $request->input("tasks.{$i}.priority"),
                ]);

                $task->users()->attach($members->whereIn('uuid', $request->input("tasks.{$i}.users"))->pluck('id'));
            }

            $currentVersion = $project->currentVersion();

            $currentVersion->update([
                'model_data' => serialize($project->refresh()->load([
                    'partner:id,organisation,sector,contact_name,contact_post,contact_phone,contact_email',
                    'division:id,unit_id,name,abbr',
                    'division.unit:id,name,abbr',
                    'nature:id,name',
                    'domains:id,name',
                    'user:id,uuid,first_name,last_name,email',
                    'users:id,uuid,first_name,last_name,email',
                    'tasks',
                    'tasks.users:id,uuid,first_name,last_name,email',
                    'existingResources:id,code,name,description,state',
                    'requestedResources:id,project_id,name,description,price,by_crti',
                ])->toArray()),
                'reason' => "This represent the project main version",
                'user_id' => $this->user->id,
            ]);

            $project->refVersionAsMain($currentVersion->id);
        });

        return redirect(route('project.show', ['project' => $project->code]))->with('info', [
            'status' => 'success',
            'title' => "Félicitation! vous venez de terminer la création de votre projet avec succés",
            'message' => "Votre projet est désormis en premier phase d'examen. Vous serez informé une fois que votre project passe au 2eme phase d'examen. Rester connecté"
        ]);
    }

    public function edit(Project $project, Version $version, AuxDataService $auxDataService)
    {
        if (!in_array($version->id, $project->getVersionMarkedAs('creation')) || $this->user->id !== $version->user_id) {
            return abort(403);
        }

        return Inertia::render('Project/Edit', [
            'version' => fn() => unserialize($version->model_data),
            'domains' => fn() => Domain::getDomains()->map(fn(Domain $domain) => $domain->only(['id', 'name', 'suggested'])),
            'natures' => fn() => Nature::getNatures()->map(fn(Nature $nature) => $nature->only(['id', 'name', 'suggested']))
        ]);
    }

    public function update(UpdateRequest $request, Project $project, Version $version)
    {
        if (!in_array($version->id, $project->getVersionMarkedAs('creation')) || $this->user->id !== $version->user_id) {
            return abort(403);
        }

        $version->update([
            'model_data' => serialize($request->all()),
        ]);

        if ($project->user_id === $version->user_id) {
            // return here to realy update the project not suggesting a new version.
            return $this->accept($request, $project, $version);
        }

        $project->refVersionAsReview($version->id);

        event(new NewVersionSuggested);

        return redirect(route('project.show', ['project' => $project->code]))->with('info', [
            'status' => 'success',
            'title' => 'Votre Proposition de Nouvelle Version Soumise',
            'message' => "Votre proposition de nouvelle version a été soumise avec succès. Elle doit maintenant être examinée par le créateur du projet. Vous serez informé une fois qu'une décision aura été prise.",
        ]);;
    }

    // mark this coming version as refused.
    public function refuse(Request $request, Project $project, Version $version) {}

    // mark this coming version as accepted
    public function accept(Request $request, Project $project, Version $version)
    {
        DB::transaction(function () use ($project, $version) {
            $data = unserialize($version->model_data);

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

            $members = User::withoutTrashed()->whereIn('uuid', collect(data_get($data, 'members'))->map(fn($m) => $m['uuid']))->get(['id', 'uuid']);

            $project->users()->sync($members->pluck('id'));

            $resources = ExistingResource::query()->whereIn('code', collect(data_get($data, 'resources'))->map(fn($resource) => $resource['code']))->pluck('id');

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
                    'status' => 'to_do',
                    'date_begin' => data_get($data, "tasks.{$i}.timeline.from"),
                    'date_end' => data_get($data, "tasks.{$i}.timeline.to"),
                    'description' => data_get($data, "tasks.{$i}.description"),
                    'priority' => data_get($data, "tasks.{$i}.priority"),
                ]);

                $task->users()->attach(
                    $members->whereIn('uuid', data_get($data, "tasks.{$i}.users"))->pluck('id')
                );
            }

            $version->update([
                'model_data' => serialize($project->refresh()->load([
                    'partner:id,organisation,sector,contact_name,contact_post,contact_phone,contact_email',
                    'division:id,unit_id,name,abbr',
                    'division.unit:id,name,abbr',
                    'nature:id,name',
                    'domains:id,name',
                    'user:id,uuid,first_name,last_name,email',
                    'users:id,uuid,first_name,last_name,email',
                    'tasks',
                    'tasks.users:id,uuid,first_name,last_name,email',
                    'existingResources:id,code,name,description,state',
                    'requestedResources:id,project_id,name,description,price,by_crti',
                ])->toArray()),
            ]);

            $previousMainVersionId = $project->getVersionMarkedAs('main');
            $project->unrefVersion($version->id);
            $project->editVersionInfo('main', $version->id);
            $project->refVersionAsPrevious($previousMainVersionId);
        });

        // Determine the type of action performed
        if ($project->user_id === $version->user_id) {
            $message = [
                'status' => 'success',
                'title' => 'Modification du projet réussie',
                'message' => 'Les modifications ont été enregistrées avec succès pour la version actuelle du projet.',
            ];
        } else {
            $message = [
                'status' => 'success',
                'title' => 'Version suggérée acceptée',
                'message' => "La version suggérée a été acceptée avec succès et est maintenant la version active du projet.",
            ];
        }

        return redirect(route('project.show', ['project' => $project->code]))->with('info', $message);
    }

    /**
     * Get the right version to duplicate.
     * Duplicate the version by editing some data like the reason & the creator of this version.
     * Reference this version as under creation. 
     */
    public function duplicate(DuplicateRequest $request, Project $project)
    {
        if (!$project->canHaveNewVersions()) {
            return abort(403);
        }

        // First, get the version IDs that are in creation mode
        $versionIds = $project->getVersionMarkedAs('creation');

        // Check if the user has any versions in creation mode
        if ($versionIds && $project->versions()->whereIn('id', $versionIds)->where('user_id', $this->user->id)->count()) {
            // Send an error back to the user
            throw new HttpResponseException(
                $this->error(code: 409, message: "You already have a version in creation mode. Please complete or discard it before creating a new one."),
            );
        }

        $version = DB::transaction(function () use ($project, $request) {
            /** @var Version */
            $version = $project->getMainVersion()->replicate(['reason', 'user_id']);

            $version->user_id = $this->user->id;
            $version->reason = $request->input('reason');
            $version->model_data = serialize([
                'data' => json_decode((new ProjectVersionResource($version->getModel()))->toJson(), true),
                'params' => []
            ]);

            $version->save();

            $project->refVersionAsCreation($version->id);

            return $version;
        });

        return ['project' =>  $project->code, 'version' => $version->id];
    }

    public function sync(Request $request, string $project, Version $version)
    {
        $version->update([
            'model_data' => serialize($request->all()),
        ]);

        return $this->success();
    }
}

if (!function_exists('array_diff_recursive')) {
    function array_diff_recursive($array1, $array2)
    {
        $result = [];
        foreach ($array1 as $key => $value) {
            if (is_array($value)) {
                if (!isset($array2[$key]) || !is_array($array2[$key])) {
                    $result[$key] = $value;
                } else {
                    $recursiveDiff = array_diff_recursive($value, $array2[$key]);
                    if (!empty($recursiveDiff)) {
                        $result[$key] = $recursiveDiff;
                    }
                }
            } elseif (!array_key_exists($key, $array2) || $array2[$key] !== $value) {
                $result[$key] = $value;
            }
        }
        return $result;
    }
}

if (!function_exists('convertEmptyStringsToNull')) {
    function convertEmptyStringsToNull(array $array)
    {
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                // Recursively process the nested array
                $array[$key] = convertEmptyStringsToNull($value);
            } elseif (is_string($value) && trim($value) === '') {
                // Convert empty string to null
                $array[$key] = null;
            }
        }
        return $array;
    }
}
