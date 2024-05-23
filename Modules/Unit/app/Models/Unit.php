<?php

namespace Modules\Unit\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\Unit\Database\Factories\UnitFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Unit extends Model
{
    use HasFactory;


    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = config('unit.table_names.unit');
    }

    protected $guarded = [];

    protected static function newFactory(): UnitFactory
    {
        return UnitFactory::new();
    }

    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => ucfirst($value),
            set: fn (?string $value) => strtolower($value),
        );
    }

    protected function abbr(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => strtoupper($value),
            set: fn (?string $value) => strtolower($value),
        );
    }

    public function divisions(): HasMany
    {
        return $this->hasMany(Division::class);
    }
}
