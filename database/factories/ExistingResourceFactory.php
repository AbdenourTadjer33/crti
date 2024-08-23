<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ExistingResource>
 */
class ExistingResourceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => 'existing_resource',
            'code' => rand(10000, 99999),
            'name' => fake()->word(),
            'description' => fake()->text(),
            'state' => fake()->word(),
        ];
    }
}
