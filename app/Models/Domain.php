<?php

namespace App\Models;

use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Domain extends Model
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
    public static function getDomains()
    {
        $domains = Cache::remember(
            'domains',
            \DateInterval::createFromDateString('1 hour'),
            fn() => static::all()->toArray()
        );

        $instance = new static;

        return Collection::make(array_map(
            fn($domain) => $instance->newInstance([], true)
                ->setRawAttributes($domain, true),
            $domains
        ));
    }

    public static function suggest(string $value)
    {
        $domain = static::query()->create([
            'name' => $value,
            'suggested' => true,
        ]);

        Cache::delete('domains');

        return $domain;
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_domain', 'domain_id', 'project_id');
    }
}
