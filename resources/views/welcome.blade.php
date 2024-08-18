<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon" href="/assets/favicon.png" type="image/png">
    <title>{{ ucfirst(config('app.name')) }}</title>

    {{-- <link rel="preconnect" href="https://fonts.bunny.net"> --}}
    {{-- <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" /> --}}

    @vite(['resources/css/app.css',  'resources/js/welcome.js'])
</head>

<body class="font-sans antialiased bg-gray-100 text-primary-950/50">

    <img id="background" class="absolute -left-20 top-0 max-w-[850px]"
        src="https://laravel.com/assets/img/welcome/background.svg" />

    @if (!Auth::check())
        <div
            class="relative min-h-screen flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 selection:bg-primary-600 selection:text-white">
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-primary-950 md:text-2xl">
                        Connectez-vous à votre compte
                    </h1>

                    <form id="auth-form" class="space-y-4 md:space-y-6">
                        <div>
                            <input type="text" name="username"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Entrez votre email professionnel" autofocus required />
                            <div id="username-error" class="mt-1 text-sm text-red-500 hidden"></div>
                        </div>

                        <x-primary-button type="submit" class="w-full">
                            Continuer
                        </x-primary-button>
                    </form>
                </div>
            </div>
        </div>
    @endif
</body>

</html>
