<?php

return [
    'name' => 'Project',
    'table_names' =>  [
        'project' => 'projects',
        'version' => 'versions'
    ],
    'columns' => [
        'fk_project' => 'project_id',
    ],
    'relation' => [
        'project' => [
            [
                'table_name' => 'tests',
                'primary' => 'id'
            ]
        ],
        'version' => [
            [
                'table_name' => 'users',
                'fk' => 'user_id',
            ]
        ],
    ]
];
