<?php

return [
    'name' => 'Permission',

    'models' => [
        'permission' => \Modules\Permission\Models\Permission::class,
        'role' => \Modules\Permission\Models\Role::class,
        'rolePermission' => \Modules\Permission\Models\RolePermission::class,
    ],

    'table_names' => [
        'permissions' => 'permissions',
        'roles' => 'roles',
        'model_has_permissions' => 'model_has_permissions',
        'model_has_roles' => 'model_has_roles',
        'role_permission' => 'role_permission',
    ],

    'columns' => [
        'fk_permission' => 'permission_id',
        'fk_role' => 'role_id',
    ],

    'cache' => [
        'expiration_time' => \DateInterval::createFromDateString('24 hours'),
        'key' => 'modules.permission.cache',
        'store' => 'file',
    ],

    'use_permission' => [

        'models_directories' => [
            [
                'path' => 'app/Models',
                'namespace' => 'App\Models',
            ],
            [
                'path' => 'Modules/Permission/app/Models',
                'namespace' => 'Modules\Permission\Models',
            ],
            [
                'path' => 'Modules/Project/app/Models',
                'namespace' => 'Modules\Project\Models',
            ],
            [
                'path' => 'Modules/Unit/app/Models',
                'namespace' => 'Modules\Unit\Models',
            ],
        ],

        'except_models' => [
            \Modules\Permission\Models\RolePermission::class,
            \Modules\Unit\Models\Division::class,
            \Modules\Project\Models\Version::class
        ],

        'actions' => [
            'create' => 'create',
            'read' => 'read',
            'update' => 'update',
            'delete' => 'delete'
        ],

        'except_actions' => ['restore', 'force-delete'],

        'file_path' => storage_path('permission'),
        'file_name' => 'use_permission.json',
    ],
];
