@if (!Auth::check())
    <div class="container px-6 lg:py-28 py-10 mx-auto">
        <div class="items-center lg:flex lg:gap-10">
            <div class="w-full lg:w-1/2">
                <div class="lg:max-w-lg">
                    <h1 class="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">Connectez-vous à votre
                        compte
                    </h1>
                    <p class="mt-3 text-gray-600 dark:text-gray-400 text-justify">
                        Bienvenue sur notre application ! Veuillez vous connecter pour accéder à votre compte et
                        explorer nos
                        fonctionnalités conçues pour soutenir vos projets de recherche. Si vous n'avez pas encore de
                        compte,
                        n'hésitez pas à vous inscrire et à rejoindre notre communauté. Votre voyage vers une gestion de
                        projet
                        efficace commence ici
                    <p>
                </div>
            </div>

            <div class="w-full mt-6 lg:mt-0 lg:w-1/2">
                <x-auth-form />
            </div>
        </div>
    </div>
@endif

<div class="bg-white">
    <div class="container px-6 py-16 mx-auto">
        <div class="items-center md:flex gap-10">
            <div class="w-full lg:w-1/2">
                <div class="lg:max-w-lg">
                    <h1 class="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">Optimisez la Gestion de
                        Vos
                        Projets de Recherche</h1>
                    <p class="mt-3 text-gray-600 dark:text-gray-400 text-justify">
                        Bienvenue sur l'application de gestion de projet de recherche
                        dédiée aux chercheurs, administrateurs et institutions.
                        Notre solution vous permet de collaborer facilement,
                        de suivre l'avancement de vos projets et de centraliser
                        les informations essentielles pour une gestion simplifiée et efficace.
                    <p>
                </div>
            </div>
            <div class="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
                <img class="w-full h-full rounded-lg lg:max-w-3xl md:rotate-2" src="assets/img-1.jpg">
            </div>
        </div>
    </div>
</div>

<div class="container px-6 py-16 mx-auto">
    <div class="items-center flex md:flex-row flex-col-reverse md:gap-10 gap-4">
        <div class="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
            <img class="w-full h-full rounded-lg lg:max-w-3xl md:-rotate-2" src="assets/img-2.jpg">
        </div>

        <div class="w-full lg:w-1/2">
            <div class="lg:max-w-lg">
                <h1 class="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
                    Suivez Vos Projets de Recherche avec Précision
                </h1>
                <p class="mt-3 text-gray-600 dark:text-gray-400 text-justify">
                    Notre application vous offre une vue complète et détaillée de l'avancement de
                    vos projets de recherche. Suivez chaque étape du processus, des premières idées
                    aux résultats finaux. Visualisez les progrès en temps réel, gérez les livrables,
                    et respectez les échéances grâce à des outils de suivi performants. Que ce soit pour
                    collaborer avec vos collègues ou pour monitorer l'état d'un projet, notre solution
                    simplifie la gestion en centralisant toutes les données importantes, vous permettant
                    de rester concentré sur l'essentiel : la réussite de vos projets.
                <p>
            </div>
        </div>

    </div>
</div>
