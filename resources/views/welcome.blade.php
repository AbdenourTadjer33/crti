<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon" href="/assets/favicon.png" type="image/png">
    <title>Accueil - {{ ucfirst(config('app.name')) }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:100,200,300,400,500,600,700,800&display=swap"
        rel="stylesheet" />

    @vite(['resources/css/app.css', 'resources/js/welcome.js'])
</head>

<body class="font-sans antialiased bg-gray-100 text-primary-950/50">
    <div class="sm:sticky top-0 w-full bg-white shadow dark:bg-gray-800 z-50">
        <x-header />
    </div>

    <x-hero />

    <x-contact />
    
    <x-footer />
</body>

</html>
