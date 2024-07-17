<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Unit extends Model
{
    use HasFactory;

    protected $guarded = [];

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
