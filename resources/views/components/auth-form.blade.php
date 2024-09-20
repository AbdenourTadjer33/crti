<form id="auth-form"
    class="bg-white flex flex-col mx-auto mt-6 space-y-3 md:space-y-0 md:flex-row border border-l-4 border-l-primary-600 rounded-md shadow p-4 py-8">

    <label class="relative flex min-w-[240px] flex-1 items-center bg-white">
        <span class="sr-only">Email</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute left-3 top-3 text-gray-950"
            width="24" height="24" viewBox="0 0 24 24" fill="none" foxified="">
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
