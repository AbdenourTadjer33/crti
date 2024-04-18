<?php

namespace Modules\Unit\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class UnitFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = \Modules\Unit\Models\Unit::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'code' => rand(100,999),
            'description' => fake()->sentence(),
            'address' => fake()->address(),
            'city' => fake()->city(),
            'country' => fake()->country(),
            'coordinates' => json_encode([]),
        ];
    }
}

