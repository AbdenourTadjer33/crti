<x-mail::message>
# Bonjour {{ $user->first_name . " " . $user->last_name }},

Nous avons le plaisir de vous informer qu'un compte a été créé pour vous dans notre système. Vous pouvez désormais accéder à l'application et commencer à explorer votre espace de travail.

Voici vos informations de connexion :

- **Adresse e-mail**: {{ $user->email }}
- **Mot de passe**: {{ $password }}

Veuillez utiliser le bouton ci-dessous pour vous connecter à votre compte :

<x-mail::button :url="url('/login?username={{ $user->email }}')">
Se Connecter
</x-mail::button>

Pour des raisons de sécurité, nous vous recommandons de modifier votre mot de passe immédiatement après vous être connecté.

Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à contacter notre équipe d'assistance.

Merci,<br>
{{ config('app.name') }}
</x-mail::message>
