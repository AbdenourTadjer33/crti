<?php

namespace Modules\Unit\Models;

use Illuminate\Database\Eloquent\Model;
use Modules\Unit\Database\Factories\UnitFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use HasFactory;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = config('unit.table_names.unit');
        $this->fillable([
            'name',
            'code',
            'description',
            'address',
            'city',
            'country',
            'coordinates',
        ]);
    }

    protected static function newFactory(): UnitFactory
    {
        return UnitFactory::new();
    }


}
