<x-mail::message>
# Le projet {{ $project->name }} est désormis en examen !

{{ $user->id === $project->user_id ? __("Votre projet {$project->name} est passé en examen.")  : __("Le projet {$this->project->name} est passé en examen ") }}


<x-mail::button :url="''">
Voir
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
