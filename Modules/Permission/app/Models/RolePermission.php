<?php

namespace Modules\Permission\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Permission\Database\factories\RolePermissionFactory;

class RolePermission extends Model
{
    use HasFactory;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = config('permission.table_names.role_permission');
        $this->fillable([
            config('permission.columns.fk_permission'),
            config('permission.columns.fk_role')
        ]);
        $this->timestamps = false;
        $this->incrementing = false;
    }

    
}
