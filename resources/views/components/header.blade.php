<header class="relative bg-white shadow dark:bg-gray-800">
    <div class="container flex-shrink-0 px-6 py-3 mx-auto md:flex items-center justify-between">
        <div class="flex md:flex-row {{ Auth::check() ? 'flex-col-reverse' : 'flex-col items-center' }}  gap-2">
            <div class="{{ Auth::check() ? 'flex items-end justify-between' : 'justify-center items-center' }}">

                <img class="w-24" src="/assets/logo.png" alt="logo" />

                <div class="flex gap-2 justify-center md:hidden">
                    {{-- @auth
                        @can('application.access')
                            <a href="/app"
                                class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm sm:text-base font-medium cursor-pointer transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 focus:ring h-10 px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 focus:ring-gray-100 dark:focus:ring-gray-800">
                                Dashboard
                            </a>
                        @else()
                            <form method="POST" action="{{ route('logout.destroy') }}">
                                <button type="submit"
                                    class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm sm:text-base font-medium cursor-pointer transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 focus:ring h-10 px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 focus:ring-gray-100 dark:focus:ring-gray-800">
                                    Se déconnecter
                                </button>
                            </form>
                        @endcan
                    @endauth --}}
                    <x-dashboard-action />
                </div>
            </div>
            <div>
                <p class="text-center text-xs md:text-base md:text-left md:whitespace-nowrap ">
                    République Algérienne Démocratique et Populaire</p>
                <p class="text-center text-xs md:text-base md:text-left md:whitespace-nowrap">
                    Ministère de l'Enseignement Supérieur et de la Recherche Scientifique
                </p>
                <p class="text-center text-sm font-semibold md:text-base md:text-left md:whitespace-nowrap">
                    Centre de Recherche en Tchnologies Industrielles -CRTI-
                </p>
            </div>
        </div>

        <div class="md:block hidden">
            <x-dashboard-action />
        </div>
    </div>
</header>
