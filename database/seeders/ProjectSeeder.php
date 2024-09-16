<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Services\Project\Project as ProjectService;

class ProjectSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $projectSerice = new ProjectService();

        foreach ($this->projects as $data) {
            $project = $projectSerice->init([
                'user_id' => data_get($data, 'members.0.id'),
                'division_id' => data_get($data, 'division'),
            ]);

            $projectSerice->store($project, $data);
        }
    }

    protected $projects = [
        [
            'name' => 'Gestion Intelligente des Déchets Urbains à l\'Aide de l\'IoT',
            'nature' => 2, // ID of "Recherche Industrielle"
            'domains' => [3, 4], // IDs for "Environnement", "IoT"
            'timeline' => [
                'from' => '2023-07-15',
                'to' => '2025-12-31',
            ],
            'description' => 'Ce projet se concentre sur la création d\'un réseau intelligent de capteurs IoT pour la gestion efficace des déchets urbains.',
            'goals' => 'Réduire les coûts de collecte des déchets et améliorer la propreté urbaine.',
            'methodology' => 'Déploiement de capteurs IoT, développement d\'un tableau de bord de gestion, analyse des données collectées.',
            'estimated_amount' => 2000000,
            'deliverables' => 'Système de capteurs IoT, application mobile, rapport d\'analyse des données.',
            'is_partner' => true,
            'partner' => [
                'organisation' => 'CleanCityTech',
                'sector' => 'Technologie Urbaine',
                'contact_name' => 'Marie Lefebvre',
                'contact_post' => 'Chef de Projet',
                'contact_phone' => '+33 6 22 33 44 55',
                'contact_email' => 'marie.lefebvre@cleancitytech.com',
            ],
            'members' => [
                ['uuid' => 'user-uuid-3'],
                ['uuid' => 'user-uuid-4'],
            ],
            'tasks' => [
                ['name' => 'Installation des capteurs IoT', 'timeline' => ['from' => '2023-08-01', 'to' => '2023-09-30'], 'description' => 'Installer des capteurs dans les bennes à ordures', 'priority' => 'haute'],
                ['name' => 'Développement d\'un logiciel de suivi', 'timeline' => ['from' => '2023-10-01', 'to' => '2024-01-31'], 'description' => 'Développer un tableau de bord pour suivre les bennes', 'priority' => 'moyenne'],
                // Add other tasks (up to 20)
            ],
            'resources' => [['code' => 'resource-789']],
            'resources_crti' => [],
            'resources_partner' => [['name' => 'Capteurs IoT', 'description' => 'Capteurs de niveau de déchets', 'price' => 50000]],
        ],
        [
            'name' => 'Optimisation Énergétique des Bâtiments Publics avec l\'IA',
            'nature' => 3, // ID of "Recherche Fondamentale"
            'domains' => [5, 6], // IDs for "Énergie", "Intelligence Artificielle"
            'timeline' => [
                'from' => '2022-05-10',
                'to' => '2024-11-30',
            ],
            'description' => 'Ce projet explore l\'utilisation de l\'intelligence artificielle pour réduire la consommation d\'énergie dans les bâtiments publics.',
            'goals' => 'Réduire la consommation d\'énergie des bâtiments publics de 20 %.',
            'methodology' => 'Collecte des données de consommation, développement d\'algorithmes d\'optimisation, simulation et tests.',
            'estimated_amount' => 1200000,
            'deliverables' => 'Rapport sur la consommation d\'énergie, modèle d\'optimisation énergétique, recommandations d\'amélioration.',
            'is_partner' => false,
            'members' => [
                ['uuid' => 'user-uuid-5'],
                ['uuid' => 'user-uuid-6'],
            ],
            'tasks' => [
                ['name' => 'Collecte de données de consommation d\'énergie', 'timeline' => ['from' => '2022-05-10', 'to' => '2022-07-31'], 'description' => 'Recueillir des données sur la consommation énergétique', 'priority' => 'haute'],
                ['name' => 'Développement d\'algorithmes d\'optimisation', 'timeline' => ['from' => '2022-08-01', 'to' => '2022-12-31'], 'description' => 'Développer des algorithmes d\'optimisation énergétique', 'priority' => 'moyenne'],
                // Add other tasks (up to 18)
            ],
            'resources' => [['code' => 'resource-654']],
            'resources_crti' => [['name' => 'Système de mesure énergétique', 'description' => 'Système de collecte de données de consommation', 'price' => 75000]],
            'resources_partner' => [],
        ],
    ];
}
