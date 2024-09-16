<?php

namespace App\Http\Controllers\Project;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Domain;
use App\Models\Nature;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Events\Project\ProjectUpdated;
use Modules\Versioning\Models\Version;
use App\Events\Project\NewVersionSuggested;
use App\Events\Project\ProjectCreated;
use App\Http\Requests\Version\StoreRequest;
use App\Http\Requests\Version\CreateRequest;
use App\Http\Requests\Version\UpdateRequest;
use Illuminate\Routing\Controllers\Middleware;
use App\Http\Requests\Version\DuplicateRequest;
use App\Events\Project\SuggestedVersionAccepted;
use App\Events\Project\SuggestedVersionRejected;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Services\Project\Project as ProjectService;
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

        if (!$project || !$project->isFirstVersion($project->versions_count)) return abort(403);

        $versionFn = function () use ($project) {
            $version = $project->currentVersion();

            if (!$version) {
                $version = $project->versions()->create([
                    'model_data' => serialize([]),
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

    public function store(StoreRequest $request, ProjectService $projectService)
    {
        /** @var Project */
        $project = $this->user->projects()->where('code', $request->route('project'))->withCount('versions')->first();

        if (!$project || !$project->isFirstVersion($project->versions_count)) {
            return abort(403);
        }

        DB::transaction(function () use ($request, $project, $projectService) {
            $project =  $projectService->store($project, $request->all());

            $version = $project->currentVersion();
            $version->model_data = serialize($project->toArray());
            $version->save();

            $project->refVersionAsMain($version->id);

            event(new ProjectCreated($project->id));
        });

        return redirect(route('project.show', ['project' => $project->code]))->with('info', [
            'status' => 'success',
            'title' => "Félicitation! vous venez de terminer la création de votre projet avec succés",
            'message' => "Votre projet est désormis xxx. Vous serez informé une fois que votre project passe au phase d'examen."
        ]);
    }

    public function edit(Project $project, Version $version)
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

    public function update(UpdateRequest $request, Project $project, Version $version, ProjectService $projectService)
    {
        if (!in_array($version->id, $project->getVersionMarkedAs('creation')) || $this->user->id !== $version->user_id) return abort(403);

        DB::transaction(function () use ($project, $version, $request, $projectService) {
            if ($project->user_id !== $version->user_id) {
                $version->model_data = serialize($request->all());
                $version->save();

                $project->refVersionAsReview($version->id);

                event(new NewVersionSuggested($project->id, $version->id));
                return;
            }

            $project = $projectService->update($project, $request->all());

            $version->model_data = serialize($project->toArray());
            $version->save();

            $previousMainVersionId = $project->getVersionMarkedAs('main');
            $project->unrefVersion($version->id);
            $project->editVersionInfo('main', $version->id);
            $project->refVersionAsPrevious($previousMainVersionId);

            event(new ProjectUpdated($project->id));
        });

        $message = [
            'status' => 'success',
            'title' => 'Votre Proposition de Nouvelle Version Soumise',
            'message' => "Votre proposition de nouvelle version a été soumise avec succès. Elle doit maintenant être examinée par le créateur du projet. Vous serez informé une fois qu'une décision aura été prise.",
        ];

        if ($project->project_id === $version->user_id) {
            $message = [
                'status' => 'success',
                'title' => 'Modification du projet réussie',
                'message' => 'Les modifications ont été enregistrées avec succès pour la version actuelle du projet.',
            ];
        }

        return redirect(route('project.show', ['project' => $project->code]))->with('info', $message);
    }

    public function accept(Request $request, ProjectService $projectService)
    {
        /** @var \App\Models\Project */
        $project = $this->user->projects()->where('code', $request->route('project'))->first();

        if (!$project || !in_array($request->route('version'), [...$project->getVersionMarkedAs('review'), ...$project->getVersionMarkedAs('creation')])) return abort(403);

        $version = $project->versions()->where('id', $request->route('version'))->first();

        DB::transaction(function () use ($project, $version, $projectService) {
            $project = $projectService->update($project, unserialize($version->model_data));

            $version->model_data = serialize($project->toArray());
            $version->save();

            $previousMainVersionId = $project->getVersionMarkedAs('main');
            $project->unrefVersion($version->id);
            $project->editVersionInfo('main', $version->id);
            $project->refVersionAsPrevious($previousMainVersionId);

            event(new SuggestedVersionAccepted($project->id, $version->id));
        });


        $message = [
            'status' => 'success',
            'title' => 'Version suggérée acceptée',
            'message' => "La version suggérée a été acceptée avec succès et est maintenant la version active du projet.",
        ];

        return redirect(route('workspace.suggested.version.index', ['project' => $project->code]))->with('info', $message);
    }

    public function reject(Request $request)
    {
        /** @var \App\Models\Project */
        $project = $this->user->projects()->where('code', $request->route('project'))->first();

        if (!$project || !in_array($request->route('version'), $project->getVersionMarkedAs('review'))) return abort(403);

        DB::transaction(function () use ($request, $project) {
            $project->refVersionAsArchived($request->route('version'));
            event(new SuggestedVersionRejected());
        });

        $message = [
            'status' => 'succes',
            'title' => 'Version suggéréé rejete',
            'message' => "La version n'est pas accepté",
        ];

        return redirect(route('workspace.suggested.version.index', ['project', $project->code]))->with('info', $message);
    }

    public function duplicate(DuplicateRequest $request, Project $project)
    {
        if (!$project->canHaveNewVersions() && !$this->user->can('suggest.versions')) {
            return abort(403);
        }

        // First, get the version IDs that are in creation mode
        $versionIds = $project->getVersionMarkedAs('creation');

        // Check if the user has any versions in creation mode
        if ($versionIds && $project->versions()->whereIn('id', $versionIds)->where('user_id', $this->user->id)->count()) {
            // Send an error back to the user
            throw new HttpResponseException(
                $this->error(code: 409, message: "Vous disposez déjà d'une version en mode création. Veuillez la compléter ou la supprimer avant d'en créer une nouvelle."),
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
        if ($version->user_id !== $this->user->id) abort(403);

        $version->update([
            'model_data' => serialize($request->all()),
        ]);

        return $this->success();
    }
}
