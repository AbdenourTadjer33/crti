<?php

return [
    'name' => 'Permission',

    'models' => [
        'permission' => \Modules\Permission\Models\Permission::class,
        'role' => \Modules\Permission\Models\Role::class,
        'rolePermission' => \Modules\Permission\Models\RolePermission::class,
        'context' => \Modules\Permission\Models\Context::class,
    ],

    'table_names' => [
        'permissions' => 'permissions',
        'contexts' => 'contexts', 
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
];
