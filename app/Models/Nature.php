<?php

namespace App\Models;

use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Nature extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'suggested' => 'boolean',
        ];
    }

    public $timestamps = false;

    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn(?string $value) => ucfirst($value),
        );
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, static>
     */
    public static function getNatures()
    {
        $natures = Cache::remember(
            'natures',
            \DateInterval::createFromDateString('1 hour'),
            fn() => static::all()->toArray(),
        );

        $instance = new static;

        return Collection::make(array_map(
            fn($nature) => $instance->newInstance([], true)
                ->setRawAttributes($nature, true),
            $natures
        ));
    }

    public static function suggest(string $value)
    {
        $nature = static::query()->create([
            'name' => $value,
            'suggested' => true,
        ]);

        Cache::delete('natures');

        return $nature;
    }

    public function project(): HasMany
    {
        return $this->hasMany(Project::class, 'nature_id', 'id');
    }
}
