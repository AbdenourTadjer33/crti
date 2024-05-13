<?php

return [
    'name' => 'Unit',
    'table_name' => 'units',
    'fk_unit' => 'unit_id',
    /*
    |--------------------------------------------------------------------------
    | Relation with unit table
    |--------------------------------------------------------------------------
    |
    | This will be used as Fk, you need to provied your table name as key 
    | or give an assoc arrar for controlling more the attribute of your FK
    |
    | table: string;
    | primary: string | null # it will use id; 
    | foreign: string | null # it will use {module_table_name}_id
    | nullable: boolean;
    | onDelete: null | "cascade" | "restrict";
    | onUpdate: null | "cascade" | "restrict";
    | comment: null | string;
    | after: null | string;
    |
    */
    'relations' => [
        [
            'table' => 'users',
            'primary' => 'id',
            'foreign' => null,
            'nullable' => true,
            'onDelete' => null,
            'onUpdate' => null,
            'comment' => null,
            'after' => 'remember_token',

        ],
        [
            'table' => 'divisions',
            'primary' => 'id',
            'nullable' => false,
            'onDelete' => 'cascade',
            'onUpdate' => 'cascade',
            'after' => 'id',
        ]
    ]
];
