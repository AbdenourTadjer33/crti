<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="shortcut icon" href="/assets/favicon.png" type="image/png">
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    {{-- <link rel="preconnect" href="https://fonts.bunny.net"> --}}
    {{-- <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" --}}
    {{-- rel="stylesheet" /> --}}

    <script>
        function themeMode() {
            try {
                const root = document.documentElement;

                let e = JSON.parse(localStorage.getItem('color-theme'));

                if (!e) {
                    e = 'system';
                    localStorage.setItem('color-theme', JSON.stringify(e));
                }

                if (e === 'dark' || (e === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    root.classList.add('dark');
                    return;
                }

                root.classList.remove('dark');
            } catch (e) {}
        }

        themeMode();

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => themeMode());
    </script>

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-50">
    @inertia
</body>

</html>
