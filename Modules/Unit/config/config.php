<?php

return [
    'name' => 'Unit',
    'table_names' => [
        'unit' => 'company'
    ],
    'columns' => [
        'fk_unit' => 'unit_id',
    ],
    'relation' => [
        [
            'table_name' => 'users',
            'primary' => 'id',
        ],
        // [
        //     'table_name' => 'divisions',
        //     'primary' => 'id'
        // ]
    ]
];
