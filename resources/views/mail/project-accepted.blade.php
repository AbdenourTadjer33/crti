<x-mail::message>
# Le projet {{ $project->name }} est accepté !

{{ $user->id === $project->user_id ? __("Votre projet {$this->project->name} est accepté.")  : __("Le projet {$this->project->name} est accepté ") }}


<x-mail::button :url="''">
Voir
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
