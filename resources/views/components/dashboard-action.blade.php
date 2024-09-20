@auth
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
@endauth
