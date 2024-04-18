<?php

namespace Modules\Unit\Traits;

use Modules\Unit\Models\Unit;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasUnit
{

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function assignToUnit($id): bool
    {
        return $this->update([
            'unit_id' => $id,
        ]);
    }

    public function hasUnit(): bool
    {
        return (bool) $this?->{config('unit.columns.fk_unit')};
    }

    public function fire(): bool
    {
        return $this->assignToUnit(null);
    }
}
