<footer class="bg-white dark:bg-gray-900">
    <div class="container px-6 py-12 mx-auto">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
            <div class="sm:col-span-2">
                <h1 class="max-w-lg text-xl font-semibold tracking-tight text-gray-800 xl:text-2xl dark:text-white">
                    Connectez-vous à votre compte</h1>

                <form id="auth-form"
                    class="flex flex-col mx-auto mt-6 space-y-3 md:space-y-0 md:flex-row border border-l-4 border-l-primary-600 rounded-md shadow p-4 py-8">

                    <label class="relative flex min-w-[240px] flex-1 items-center bg-white">
                        <span class="sr-only">Email</span>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="pointer-events-none absolute left-3 top-3 text-gray-950" width="24"
                            height="24" viewBox="0 0 24 24" fill="none" foxified="">
                            <path
                                d="M8.828 14.722a.24.24 0 0 0 .144.048h6.066a.26.26 0 0 0 .144-.048l7.36-5.52a.25.25 0 0 0 .096-.192.22.22 0 0 0-.105-.192L12.825 2.11a1.438 1.438 0 0 0-1.648 0L1.458 8.809a.25.25 0 0 0-.096.192.21.21 0 0 0 .096.201l7.37 5.52Z"
                                fill="currentColor" />
                            <path
                                d="M16.868 15.249a.268.268 0 0 0-.096.201.279.279 0 0 0 .105.192l3.191 2.108a.719.719 0 1 1-.795 1.188L15.2 16.226a.24.24 0 0 0-.134 0H8.933a.24.24 0 0 0-.134 0l-4.063 2.731a.723.723 0 0 1-.796-1.207l3.182-2.108a.23.23 0 0 0 .086-.192.24.24 0 0 0-.096-.201L.883 10.563a.22.22 0 0 0-.249 0 .23.23 0 0 0-.134.192v9.526a1.917 1.917 0 0 0 1.917 1.917h19.167a1.918 1.918 0 0 0 1.917-1.917v-9.516a.23.23 0 0 0-.134-.22.24.24 0 0 0-.249 0l-6.25 4.704Z"
                                fill="currentColor" />
                        </svg>

                        <input type="text" name="username"
                            class="w-full rounded-lg border-gray-100 bg-transparent px-12 py-3 text-gray-900 placeholder-gray-600 transition focus:border-gray-100 focus:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-primary-600/80 focus:ring-offset-2"
                            placeholder="Entrer votre email professionnel">
                    </label>

                    <x-primary-button type="submit" class="md:w-auto md:ml-4 focus:outline-none">
                        Connexion
                    </x-primary-button>
                </form>
            </div>

            <div>
                <p class="font-semibold text-gray-800 dark:text-white">Structures de recherche</p>

                <div class="flex flex-col items-start mt-5 space-y-2">
                    <a href="https://crti.dz/" target="_blank"
                        class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">
                        Divisions de recherche -Cheraga-
                    </a>
                    <a href="https://crti.dz/unit-divisions.php?u=4" target="_blank"
                        class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">
                        Fabrication additive -Setif-
                    </a>
                    <a href="https://crti.dz/unit-divisions.php?u=8" target="_blank"
                        class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">
                        Mines et métallurgie -Annaba-
                    </a>
                </div>
            </div>

            <div>
                <p class="font-semibold text-gray-800 dark:text-white">Réseaux sociaux</p>

                <div class="flex flex-col items-start mt-5 space-y-2">
                    <a href="#"
                        class="flex gap-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">
                        <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path fill-rule="evenodd"
                                d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                                clip-rule="evenodd" />
                        </svg>
                        <span>Facebook</span>
                    </a>
                    <a href="#" target="_blank"
                        class="flex gap-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">
                        <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path fill-rule="evenodd"
                                d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z"
                                clip-rule="evenodd" />
                        </svg>
                        <span>Youtube</span>
                    </a>
                    <a href="#"
                        class="flex gap-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">
                        <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                        </svg>
                        <span>X</span>
                    </a>
                </div>
            </div>
        </div>


        <hr class="my-6 border-gray-200 md:my-8 dark:border-gray-700" />
        <div class="flex flex-col items-center justify-between gap-2">
            <img class=" w-20" src="/assets/logo.png" alt="logo" />
            <p class="mt-4 text-sm text-gray-500 sm:mt-0 dark:text-gray-300 text-center">
                Copyright 2024 © CRTI All Rights Reserved Research Center in Industrial Technologies - CRTI P.O.Box 64,
                Cheraga 16014 Algiers,
                Algeria www.crti.dz
            </p>
        </div>
    </div>
</footer>
