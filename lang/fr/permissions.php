<?php

return [
    "features" => [
        "application" => "application",
        "workspace" => "espace de travail",
        "boards" => "conseil scientifique",
        "projects" => "projets",
        "roles&permissions" => "roles et permissions",
        "units&divisions" => "unités et divisions",
        "users" => "utilisateurs",
        "resources" => "ressources",
    ],
    "actions" => [
        "access" => [
            "name" => "accéder",
        ],
        "create" => [
            "name" => "créer",
        ],
        "manage" => [
            "name" => "gérer",
            "description" => "Autorisation de gérer toutes les instances de :feature.",
        ],
        "read" => [
            "name" => "lire",
            "description" => "Accorde à l'utilisateur l'autorisation de lire toutes les instances de :feature.",
        ],
        "read-related" => [
            "name" => "lire connexe",
            "description" => "Accorde à l'utilisateur l'autorisation de lire uniquement ses propres instances de :feature.",
        ],
        "read-related-divisions" => [
            "name" => "lire celle des divisions connexes",
            "description" => "Accorde à l'utilisateur l'autorisation de lire toutes les instances de :feature qui appartiennent à leurs divisions.",
        ],
        "read-related-members" => [
            "name" => "lire les instances où l'utilisateur est membre",
            "description" => "Accorde à l'utilisateur l'autorisation de lire toutes les instances de :feature dont il est membre.",
        ],
        "suggest" => [
            "name" => "suggérer",
            "description" => "Accorde à l'utilisateur l'autorisation de suggérer des modifications à :feature.",
        ],
        "suggest-related" => [
            "name" => "créer une nouvelle version sur les instances connexes",
            "description" => "Accorde à l'utilisateur l'autorisation créer une nouvelle version à ses propres instances de :feature.",
        ],
        "suggest-related-divisions" => [
            "name" => "suggérer des versions sur les instances liées aux divisions",
            "description" => "Accorde à l'utilisateur l'autorisation de suggérer des modifications aux instances de :feature qui appartiennent à leurs divisions.",
        ],
        "suggest-related-members" => [
            "name" => "suggérer des versions sur les instances ou l'utilisateur est member",
            "description" => "Accorde à l'utilisateur l'autorisation de suggérer des modifications aux membres associés à des projets ou des divisions..",
        ],
    ],
];
