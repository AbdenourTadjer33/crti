<?php

namespace Modules\Unit\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DivisionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = \Modules\Unit\Models\Division::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [];
    }
}

