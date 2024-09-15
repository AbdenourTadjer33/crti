<header class="relative bg-white shadow dark:bg-gray-800">
    <div class="container flex-shrink-0 px-6 py-3 mx-auto md:flex items-center justify-between">
        <div class="flex items-center gap-2">
            <img class="w-24" src="/assets/logo.png" alt="logo" />
            <div>
                <p class="text-center text-xs md:text-base sm:text-left md:whitespace-nowrap ">
                    République Algérienne Démocratique et Populaire</p>
                <p class="text-center text-xs md:text-base sm:text-left md:whitespace-nowrap">
                    Ministère de l'Enseignement Supérieur et de la Recherche Scientifique
                </p>
                <p class="text-center text-sm font-semibold md:text-base sm:text-left md:whitespace-nowrap">
                    Centre de Recherche en Tchnologies Industrielles -CRTI-
                </p>
            </div>
        </div>
        {{-- <div
            class="flex overflow-x-auto overflow-y-hidden border-b border-gray-200 whitespace-nowrap dark:border-gray-700 justify-between">
            <button
                class="inline-flex items-center h-10 px-4 -mb-px text-sm text-center text-blue-600 bg-transparent border-b-2 border-blue-500 sm:text-base dark:border-blue-400 dark:text-blue-300 whitespace-nowrap focus:outline-none">
                Profile
            </button>

            <button
                class="inline-flex items-center h-10 px-4 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-transparent sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400">
                Account
            </button>

            <button
                class="inline-flex items-center h-10 px-4 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-transparent sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400">
                Notification
            </button>
        </div> --}}

        <div class="flex gap-2 justify-center">
            @if (!Auth::check())
                <button
                    id="goto-authentication-form"
                    class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm sm:text-base font-medium cursor-pointer transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 focus:ring h-10 px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 focus:ring-gray-100 dark:focus:ring-gray-800">
                    Connexion
                </button>
            @else
                <a href="/login"
                    class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm sm:text-base font-medium cursor-pointer transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 focus:ring h-10 px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 focus:ring-gray-100 dark:focus:ring-gray-800">
                    Dashboard
                </a>
            @endif
        </div>
    </div>
</header>
